module addrx::airnft {
    // Add events 
    use aptos_framework::randomness;
    use aptos_framework::account::{Self, SignerCapability};
    use std::signer;
    use std::string::{Self, String};
    use aptos_framework::object::{Self,Object};
    use aptos_token_objects::token::{Self,Token,BurnRef,MutatorRef};
    use aptos_token_objects::royalty;
    use aptos_token_objects::collection;
    use aptos_framework::option;
    use aptos_framework::event::{Self};
    use std::timestamp;
    use std::bcs;
    use std::simple_map::{SimpleMap,Self};
    use std::vector::{Self};


    const ERROR_SIGNER_NOT_ADMIN: u64 = 0;
    const ENOT_OWNER: u64 = 1;
    const ENOT_EXISTS: u64 = 2;


    
    const SEED: vector<u8> = b"airnft";
    const COLLECTION_NAME: vector<u8> = b"AirNft";
    const CHILD_TOKEN_URI: vector<u8> = b"ipfs://bafybeico3rbfsdwqtdq6a7bikvowmzdef6dfp6zhtahnnaomgpykfrgnqi/";
    const CHILD_TOKEN_DESC: vector<u8> = b"New Token Child";
    const CHILD_TOKEN_NAME: vector<u8> = b"New Token Child";

    struct TokenRefs has key{
        // Used for editing the token data
        mutator_ref: MutatorRef,
        // Used for burning the token
        burn_ref: BurnRef,
    }

    struct TokenSpec has key {
        parentA: u64,
        parentB: u64,
        child : u64,
        createdAt: u64,
    }
    
    struct State has key {
        token_list: SimpleMap<u64,address>,
        cap: SignerCapability,
        totalMinted: u64,
    }

    // ==============================================================================================
    // Event structs
    // ==============================================================================================
    #[event]
    struct CreateNewTokenEvent has store, drop {
        name: String,
        url: String,
        child_attribute: u64,
        createdAt: u64,
    }
    #[event]
    struct BreedAndBurnedTokenEvent has store, drop {
        parentA_ID: u64,
        parentA_value: u64,
        parentB_ID: u64,
        parentB_value: u64,
        child_value: vector<u64>,
        createdAt: u64,
    }

    #[event]
    struct GetNewToken has store,drop{
        owner: address,
        tokenId: u64,
    }

    #[event]
    struct UpdateData has store,drop{
        Type: String,
        Value: String,
    }

    // let res_signer = account::create_signer_with_capability(&state.cap);

    public entry fun launch_collection(user: &signer,collection_desc: String, collection_uri: String) {
        assert_admin(signer::address_of(user));
        let (resource_signer, _resource_cap) = account::create_resource_account(user, SEED);
        let royalty = royalty::create(5,100,@addrx);
        let description = bcs::to_bytes(&collection_desc);
        let uri = bcs::to_bytes(&collection_uri);

        // Create NFT collection with an unlimited supply and the following params:
        collection::create_unlimited_collection(
            &resource_signer,
            string::utf8(description),
            string::utf8(COLLECTION_NAME),
            option::some(royalty),
            string::utf8(uri)
        );

        move_to(user, State{
            token_list: simple_map::create(),
            cap: _resource_cap,
            totalMinted: 0,
        });

    }
       
    fun mint_token(creator: &signer,token_desc: String,token_name: String,token_uri: String,parent_A: u64,parent_B: u64,child_val: u64) acquires State{
        let creator_address = signer::address_of(creator);
        let state = borrow_global_mut<State>(@addrx);
        let res_signer = account::create_signer_with_capability(&state.cap);
        // TO set royalty
        let royalty = royalty::create(5,100,@addrx);
        // Create a new named token:
        let token_const_ref = token::create_named_token(
            &res_signer,
            string::utf8(COLLECTION_NAME),
            token_desc,
            token_name,
            option::some(royalty),
            token_uri
        );

        let obj_signer = object::generate_signer(&token_const_ref);
        let obj_addr= object::address_from_constructor_ref(&token_const_ref);
        
        // Transfer the token to the user account
        object::transfer_raw(&res_signer, obj_addr,creator_address);
        is_asset_owner(creator_address,obj_addr);

        // INSET TOKEN REFERENCE 
        move_to(&obj_signer, TokenRefs {
            mutator_ref: token::generate_mutator_ref(&token_const_ref),
            burn_ref: token::generate_burn_ref(&token_const_ref),
        });

        //ADD ADITTIONAL FIELDS
        move_to(&obj_signer, TokenSpec{  
            parentA: parent_A,
            parentB: parent_B,
            child : child_val,
            createdAt: timestamp::now_seconds(),
        });

        // INSERT IN THE STATE LIST
        let token_list = state.token_list;
        let count = state.totalMinted;
        count = count + 1;
        simple_map::add(&mut token_list,count,obj_addr);

        let event = CreateNewTokenEvent {
            name: token_name,
            url: token_uri,
            child_attribute: child_val,
            createdAt: timestamp::now_seconds(),
        };
        event::emit(event);
    }

    public entry fun mint_new_token(user: &signer,desc: String,name: String,uri: String,val: u64) acquires State{
        assert_admin(signer::address_of(user));
        mint_token(user,desc,name,uri,0,0,val);
    }

    public entry fun get_token(user: &signer, token_id: u64) acquires State {

        let creator_address = signer::address_of(user);
        let state = borrow_global_mut<State>(@addrx);

        let res_signer = account::create_signer_with_capability(&state.cap);

        let token = state.token_list;
        let token_addr  = simple_map::borrow(&mut token,&token_id);
        let addr = *token_addr;
        // TO CHECK IF SOMEONE ELSE HOLD OTHER THAN ADMIN
        is_asset_owner(@addrx,addr);
        // Transfer the token to the user account
        object::transfer_raw(&res_signer,addr,creator_address);

        is_asset_owner(creator_address,addr);

    }

    public entry fun breed(user: &signer,token_id_A: u64, token_id_B: u64) acquires State,TokenSpec,TokenRefs {
        let creator_address = signer::address_of(user);
        let x = borrow_global_mut<State>(creator_address);

        let addr_ref_A = simple_map::borrow(&mut x.token_list, &token_id_A);
        let addrA = *addr_ref_A;

        let addr_ref_B = simple_map::borrow(&mut x.token_list, &token_id_B);
        let addrB = *addr_ref_B;
 
        // MIX THE ATTRIBUTES
        let random_num = randomness::u64_range(1,4);

        let parent_A_spec = borrow_global<TokenSpec>(addrA);
        let parentA = parent_A_spec.child;
        let parent_B_spec = borrow_global<TokenSpec>(addrB);
        let parentB = parent_B_spec.child;
        
        let i = 0;
        let child = vector::empty<u64>();

        while(i < random_num){

            let t = timestamp::now_seconds();
            let child_specs = (parentA + parentB +t)/ random_num;
            vector::push_back(&mut child,child_specs);
            mint_token(
                user,
                string::utf8(CHILD_TOKEN_DESC),
                string::utf8(CHILD_TOKEN_NAME),
                string::utf8(CHILD_TOKEN_URI),
                parentA,
                parentB,
                child_specs
            );
            i = i + 1;
        };

    let event = BreedAndBurnedTokenEvent {
        parentA_ID: token_id_A,
        parentA_value: parentA, 
        parentB_ID: token_id_B,
        parentB_value: parentB,
        child_value: child,
        createdAt: timestamp::now_seconds(),
    };

        event::emit(event);

        burn_token(addrA);
        burn_token(addrB);

   
    }


    public entry fun update_token_uri(user: &signer,token_id: u64 , token_uri: String) acquires State,TokenRefs{
        assert_admin(signer::address_of(user));
        let x = borrow_global_mut<State>(@addrx);
        //To fetch the address of the object
        let token = simple_map::borrow_mut(&mut x.token_list, &token_id);
        //DEFERENCE THE VALUE
        let token_addr = *token;
        // TO CHECK IS IT DESTORYED
        is_asset_burned(token_addr);
        // Correctly borrowing mutator_ref as a reference
        let token_refs = borrow_global_mut<TokenRefs>(token_addr);
        // Passing &mutator_ref to comply with the expected function signature
        token::set_uri(&token_refs.mutator_ref, token_uri);

        let event = UpdateData{
            Type: string::utf8(b"TOKEN_URI"),
            Value: token_uri,
        };

        event::emit(event);

    }

    fun update_token_name(user: &signer,token_id: u64 , token_name: String) acquires State,TokenRefs{
        let x = borrow_global_mut<State>(@addrx);
        //To fetch the address of the object
        let token = simple_map::borrow_mut(&mut x.token_list, &token_id);
        //DEFERENCE THE VALUE
        let token_addr = *token;
        is_asset_owner(signer::address_of(user),token_addr);

        // Correctly borrowing mutator_ref as a reference
        let token_refs = borrow_global_mut<TokenRefs>(token_addr);
        // Passing &mutator_ref to comply with the expected function signature
        token::set_name(&token_refs.mutator_ref,token_name);

        let event = UpdateData{
            Type: string::utf8(b"TOKEN_NAME"),
            Value: token_name,
        };

        event::emit(event);
   }
    
    fun update_token_description(user: &signer,token_id: u64 , token_desc: String) acquires State,TokenRefs{
        let x = borrow_global_mut<State>(@addrx);
        //To fetch the address of the object
        let token = simple_map::borrow_mut(&mut x.token_list, &token_id);
        //DEFERENCE THE VALUE
        let token_addr = *token;

        is_asset_owner(signer::address_of(user),token_addr);
        // Correctly borrowing mutator_ref as a reference
        let token_refs = borrow_global_mut<TokenRefs>(token_addr);
        token::set_description(&token_refs.mutator_ref,token_desc);

        
        let event = UpdateData{
            Type: string::utf8(b"TOKEN_DESC"),
            Value: token_desc,
        };

        event::emit(event);
    }


    fun burn_token(token: address) acquires TokenRefs{
      let TokenRefs {
        mutator_ref: _,
        burn_ref,
      } = move_from<TokenRefs>(token);
      token::burn(burn_ref); 
   }    

    //==============================================================================================
    // Validation functions
    //==============================================================================================
    inline fun assert_admin(user: address) {
        assert!(user == @addrx, ERROR_SIGNER_NOT_ADMIN);
    }

    inline fun is_asset_owner(user: address, token: address){
        is_asset_burned(token);
        assert!(user == object::owner(create_token_from_address(token)), ENOT_OWNER);
    }

    inline fun is_asset_burned(token: address){
        assert!(object::object_exists<Token>(token),ENOT_EXISTS);
    }

    inline fun create_token_from_address(token: address): Object<Token>{
        let obj_ref = object::address_to_object(token);
        obj_ref
    }

}