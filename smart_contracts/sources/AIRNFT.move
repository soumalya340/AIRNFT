module addrx::airnft {
    // Add events 
    use aptos_framework::randomness;
    use aptos_framework::account::{Self, SignerCapability};
    use std::signer;
    use std::string::{Self, String};
    use aptos_framework::object::{Self,Object,TransferRef};
    use aptos_token_objects::token::{Self,Token,BurnRef,MutatorRef};
    use aptos_token_objects::royalty;
    use aptos_token_objects::collection;
    use aptos_framework::option;
    use aptos_framework::event::{Self};
    use std::timestamp;
    use std::bcs;
    use std::simple_map::{SimpleMap,Self};
    use std::vector::{Self};
    use std::debug;


    const ERROR_SIGNER_NOT_ADMIN: u64 = 0;
    const ENOT_OWNER: u64 = 1;
    const ENOT_EXISTS: u64 = 2;

    const COLLECTION_NAME: vector<u8> = b"AIRNFT";
    const CHILD_TOKEN_URI: vector<u8> = b"ipfs://bafybeico3rbfsdwqtdq6a7bikvowmzdef6dfp6zhtahnnaomgpykfrgnqi/";
    const CHILD_TOKEN_DESC: vector<u8> = b"New Token Child";

    struct TokenRefs has key{
        // Used for editing the token data
        mutator_ref: MutatorRef,
        // Used for burning the token
        burn_ref: BurnRef,
        //Used for Transferring the token
        transfer_ref: TransferRef,
    }

    struct TokenSpec has copy,key {
        parentA: u64,
        parentB: u64,
        child : u64,
    }

    struct AttributeSpec has copy,key {
        type: SimpleMap<u64,String>,
        item: SimpleMap<u64,String>,
    }
    
    
    struct State has key {
        collection_name: String,
        token_list: SimpleMap<u64,address>,
        cap: SignerCapability,
        totalMinted: u64,
    }

    // ==============================================================================================
    // Event structs
    // ==============================================================================================
    #[event]
    struct CreateTokenEvent has store, drop {
        token_id: u64,
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
        let royalty = royalty::create(5,100,@addrx);
        let description = bcs::to_bytes(&collection_desc);
        let uri = bcs::to_bytes(&collection_uri);

        // let name = bcs::to_bytes(&collection_Name);
        let (resource_signer, _resource_cap) = account::create_resource_account(user,COLLECTION_NAME);
        // Create NFT collection with an unlimited supply and the following params:
        collection::create_unlimited_collection(
            &resource_signer,
            string::utf8(description),
            string::utf8(COLLECTION_NAME),
            option::some(royalty),
            string::utf8(uri)
        );

        move_to(&resource_signer, State{
            collection_name: string::utf8(COLLECTION_NAME),
            token_list: simple_map::create(),
            cap: _resource_cap,
            totalMinted: 0,
        });

        move_to(user, AttributeSpec{
            type: simple_map::create(),
            item: simple_map::create(),
        });

    }

    fun mint_token(creator: &signer,token_desc: String,token_name: String,token_uri: String,parent_A: u64,parent_B: u64,child_val: u64) acquires State{
        let creator_address = signer::address_of(creator);
        let resource_addr = get_resource_address();
        let state = borrow_global_mut<State>(resource_addr);

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

        // INSET TOKEN REFERENCE 
        move_to(&obj_signer, TokenRefs {
            mutator_ref: token::generate_mutator_ref(&token_const_ref),
            burn_ref: token::generate_burn_ref(&token_const_ref),
            transfer_ref: object::generate_transfer_ref(&token_const_ref),
        });

        //ADD ADITTIONAL FIELDS
        move_to(&obj_signer, TokenSpec{  
            parentA: parent_A,
            parentB: parent_B,
            child : child_val,
        });

        // INSERT IN THE STATE LIST
        let count = state.totalMinted + 1;
        state.totalMinted = count;
        simple_map::add(&mut state.token_list,count,obj_addr);

        let event = CreateTokenEvent {
            token_id: count,
            name: token_name,
            url: token_uri,
            child_attribute: child_val,
            createdAt: timestamp::now_seconds(),
        };
        event::emit(event);
    }    

    public entry fun mint_new_token(user: &signer,desc: String,name: String,uri: String,attribute_val: u64) acquires State{
        assert_admin(signer::address_of(user));
        mint_token(user,desc,name,uri,0,0,attribute_val);
    }

    public entry fun update_attribute_details(user: &signer,type_id: u64, type_info: String, item_id: u64, item_info: String) acquires AttributeSpec {
        let creator_address = signer::address_of(user);
        let attribute = borrow_global_mut<AttributeSpec>(creator_address);
        let attribute_type = attribute.type;
        let attribute_item = attribute.item;
        simple_map::add(&mut attribute_type,type_id,type_info);
        simple_map::add(&mut attribute_item,item_id,item_info);

    }


    public entry fun get_tokens(user: &signer, token_id: u64) acquires State,TokenRefs {
        let user_address = signer::address_of(user);
        let resource_addr = get_resource_address();
        let state = borrow_global_mut<State>(resource_addr);

        let res_signer = account::create_signer_with_capability(&state.cap);


        let token = state.token_list;
        let token_addr  = simple_map::borrow(&mut token,&token_id);
        let addr = *token_addr;
        // Transfer the token to the user account
         let token_refs = borrow_global<TokenRefs>(addr);
        // Now pass a reference to transfer_ref
        let linear_transfer_ref = object::generate_linear_transfer_ref(&token_refs.transfer_ref);
        object::transfer_with_ref(linear_transfer_ref, user_address);

    }

  
    fun breed(user: &signer,token_id_A: u64, token_id_B: u64, name: vector<String>) acquires State,TokenSpec,TokenRefs {
        let creator_address = signer::address_of(user);
        debug::print(&string::utf8(b"2"));
        let resource_addr = get_resource_address();
        let x = borrow_global_mut<State>(resource_addr);

        let addr_ref_A = simple_map::borrow(&mut x.token_list, &token_id_A);
        let addrA = *addr_ref_A;
        is_asset_owner(creator_address,addrA);
        let addr_ref_B = simple_map::borrow(&mut x.token_list, &token_id_B);
        let addrB = *addr_ref_B;
        is_asset_owner(creator_address,addrB);

        // MIX THE ATTRIBUTES
        // let random = generate_random();
        let random = 2;
        let parent_A_spec = borrow_global<TokenSpec>(addrA);
        let parentA = parent_A_spec.child;
        let parent_B_spec = borrow_global<TokenSpec>(addrB);
        let parentB = parent_B_spec.child;
        
        let i = 0;
        let child = vector::empty<u64>();
        debug::print(&string::utf8(b"1"));
        let name1 = *vector::borrow(&name,0);
        let name2 = *vector::borrow(&name,1);
        let name3 = *vector::borrow(&name,2);

        let i = 0;
        while(i < random){
            // let random_num = generate_random();
            let random_num = 2;
            let t = timestamp::now_seconds();
            let child_specs = (parentA + parentB +t)/ random_num;
            vector::push_back(&mut child,child_specs);
            let token_name = string::utf8(b"hey");
            if(i == 0){
                token_name = name1; 
            }
            else if(i == 1){
                token_name = name2;
            }
            else {
                token_name = name3;
            };

            mint_token(
                user,
                string::utf8(CHILD_TOKEN_DESC),
                token_name,
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
        let resource_addr = get_resource_address();
        let x = borrow_global_mut<State>(resource_addr);
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

    public entry fun update_token_name(user: &signer,token_id: u64 , token_name: String) acquires State,TokenRefs{
        let resource_addr = get_resource_address();
        let x = borrow_global_mut<State>(resource_addr);
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
    
    public entry fun update_token_description(user: &signer,token_id: u64 , token_desc: String) acquires State,TokenRefs{
         let resource_addr = get_resource_address();
        let x = borrow_global_mut<State>(resource_addr);
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
        transfer_ref:_,
      } = move_from<TokenRefs>(token);
      token::burn(burn_ref); 
   }    

    //==============================================================================================
    // Validation functions
    //==============================================================================================
    inline fun assert_admin(user: address) {
        assert!(user == @addrx, ERROR_SIGNER_NOT_ADMIN);
    }

    inline fun generate_random(): u64 {
        let rand = randomness::u64_range(1,4);
        rand

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

    inline fun get_resource_address(): address {
        let resource_account_address = account::create_resource_address(&@addrx, COLLECTION_NAME);
        resource_account_address
    }

    //==============================================================================================
    // Test functions
    //=============================================================================================
    #[test(user = @addrx)]
    fun test_launch_collection(user: &signer ) acquires State{

        let admin_address = signer::address_of(user);
        account::create_account_for_test(admin_address);

        // let name = string::utf8(b"AIRNFT");
        let dsec = string::utf8(b"AIRNFT is awesome");
        let uri = string::utf8(b"www.xyz.com");
        launch_collection(user,dsec,uri);

        // let seed = bcs::to_bytes(&name);
        let description = bcs::to_bytes(&dsec);
        let url = bcs::to_bytes(&uri);

        let expected_resource_account_address = account::create_resource_address(&admin_address, COLLECTION_NAME);
        assert!(account::exists_at(expected_resource_account_address), 0);

        let resource_account_address = get_resource_address();
        let state = borrow_global<State>(resource_account_address);
        assert!(
            account::get_signer_capability_address(&state.cap) == expected_resource_account_address,
            0
        );

        let expected_collection_address = collection::create_collection_address(
            &expected_resource_account_address,
            &string::utf8(COLLECTION_NAME)
        );
        let collection_object = object::address_to_object<collection::Collection>(expected_collection_address);
        assert!(
            collection::creator<collection::Collection>(collection_object) == expected_resource_account_address,
            4
        );
        assert!(
            collection::name<collection::Collection>(collection_object) == string::utf8(COLLECTION_NAME),
            4
        );
        assert!(
            collection::description<collection::Collection>(collection_object) == string::utf8(description),
            4
        );
        assert!(
            collection::uri<collection::Collection>(collection_object) == string::utf8(url),
            4
        );

        assert!(exists<AttributeSpec>(admin_address),4);

        // assert!(event::counter(&state.nft_minted_events) == 0, 4);
    }
    #[test(user = @0x1)]
    #[expected_failure(abort_code = 0)]
    fun test_launch_collection_if_fails(user:&signer){
        // let name = string::utf8(b"AIRNFT");
        let dsec = string::utf8(b"AIRNFT is awesome");
        let uri = string::utf8(b"www.xyz.com");
       launch_collection(user,dsec,uri);
    }

    #[test(user = @addrx)]
    fun test_to_mint_token(user: &signer) acquires State,TokenSpec {

        let admin_address = signer::address_of(user);

        // COLLECTION DETAILS
        let dsec = string::utf8(b"AIRNFT is awesome");
        let uri = string::utf8(b"www.xyz.com");
        launch_collection(user,dsec,uri);
        // TOKEN DETAILS
        let nft_name = string::utf8(b"Hello");
        let nft_desc = string::utf8(b"hehehe");
        let image_uri = string::utf8(b"www.xyz.com");      
        let attribute_value = 112233;

        let  resource_account_address = get_resource_address();
        let state = borrow_global<State>(resource_account_address);
        
        let aptos_framework = account::create_account_for_test(@aptos_framework);
        timestamp::set_time_has_started_for_testing(&aptos_framework);

        mint_new_token(user,nft_desc,nft_name,image_uri,attribute_value);

        let expected_nft_token_address = token::create_token_address(
            &resource_account_address,
            &string::utf8(COLLECTION_NAME),
            &nft_name,
        );

        let nft_token_object = object::address_to_object<token::Token>(expected_nft_token_address);
        assert!(
            object::is_owner(nft_token_object, admin_address) == true,
            1
        );
        assert!(
            token::creator(nft_token_object) == resource_account_address,
            4
        );
        assert!(
            token::name(nft_token_object) == nft_name,
            4
        );
        assert!(
            token::description(nft_token_object) == nft_desc,
            4
        );
        assert!(
            token::uri(nft_token_object) == image_uri,
            4
        );
        assert!(
            option::is_some<royalty::Royalty>(&token::royalty(nft_token_object)),
            4
        );
        
        let token = borrow_global<TokenSpec>(expected_nft_token_address);
        assert!(token.parentA == 0,0);       
        assert!(token.parentB == 0,0);       
        assert!(token.child == attribute_value,0);      

        let state1 = borrow_global<State>(resource_account_address);

        assert!(state1.totalMinted == 1,0);
        
        let count  = state1.totalMinted;
        let list = state1.token_list;

        assert!(simple_map::contains_key(&mut list,&1)== true,1);
        let nft_addr = simple_map::borrow(&mut list,&count);
        let addr = *nft_addr;
        assert!(addr == expected_nft_token_address,0);

    }
    #[test (user = @0x6 , admin = @addrx)]
    fun test_get_tokens(user: &signer , admin: &signer) acquires State,TokenRefs{
        let user_address = signer::address_of(user);
        let admin_address = signer::address_of(admin);
         // COLLECTION DETAILS
        let dsec = string::utf8(b"AIRNFT is awesome");
        let uri = string::utf8(b"www.xyz.com");
        launch_collection(admin,dsec,uri);
        // TOKEN DETAILS
        let nft_name = string::utf8(b"Hello");
        let nft_desc = string::utf8(b"hehehe");
        let image_uri = string::utf8(b"www.xyz.com");      
        let attribute_value = 1122334455;

        let  resource_account_address = get_resource_address();
        let state = borrow_global<State>(resource_account_address);
        
        let aptos_framework = account::create_account_for_test(@aptos_framework);
        timestamp::set_time_has_started_for_testing(&aptos_framework);

        // let resource_account_address = account::create_resource_address(&admin_address, COLLECTION_NAME);
        mint_new_token(admin,nft_desc,nft_name,image_uri,attribute_value);

        let expected_nft_token_address = token::create_token_address(
            &resource_account_address,
            &string::utf8(COLLECTION_NAME),
            &nft_name,
        );

        get_tokens(user,1);

        let nft_token_object = object::address_to_object<token::Token>(expected_nft_token_address);
        assert!(
            object::is_owner(nft_token_object, user_address) == true,
            1
        );

    }

    #[test(user = @0x123, admin = @addrx)]
    fun test_breed(user:&signer , admin: &signer) acquires State,TokenRefs,TokenSpec {
        let user_address = signer::address_of(user);
        let admin_address = signer::address_of(admin);

        let aptos_framework = account::create_account_for_test(@aptos_framework);
        timestamp::set_time_has_started_for_testing(&aptos_framework);
        
        // COLLECTION DETAILS
        let dsec = string::utf8(b"AIRNFT is awesome");
        let uri = string::utf8(b"www.xyz.com");
        launch_collection(admin,dsec,uri);
        // TOKEN DETAILS 1
        let nft_name = string::utf8(b"Hello");
        let nft_desc = string::utf8(b"hehehe");
        let image_uri = string::utf8(b"www.xyz.com");      
        let attribute_value = 1122334455;
        // TOKEN DETAILS 2
        let nft_name2 = string::utf8(b"Hello2");
        let nft_desc2 = string::utf8(b"hehehe2");
        let image_uri2 = string::utf8(b"www.xyz2.com");      
        let attribute_value2 = 2222222222;

        let  resource_account_address = get_resource_address();
        let state = borrow_global<State>(resource_account_address);
        
       
        mint_new_token(admin,nft_desc,nft_name,image_uri,attribute_value);
        mint_new_token(admin,nft_desc2,nft_name2,image_uri2,attribute_value2);

        get_tokens(user,1);
        get_tokens(user,2);
        let addr1 = token::create_token_address(
            &resource_account_address,
            &string::utf8(COLLECTION_NAME),
            &nft_name,
        );
        let addr2 = token::create_token_address(
            &resource_account_address,
            &string::utf8(COLLECTION_NAME),
            &nft_name2,
        );

        ////////////////////////////////////////////////////////////////////////////
        // randomness::initialize_for_testing(&aptos_framework); 
        let list = vector::empty<String>();
        vector::push_back(&mut list, string::utf8(b"Loco"));
        vector::push_back(&mut list, string::utf8(b"Poco"));
        vector::push_back(&mut list, string::utf8(b"Shcoho"));

        breed(user,1,2,list);

        let name1 = *vector::borrow(&list, 0);
        let name2 = *vector::borrow(&list, 1);
        // to check if the new token have the name 
        // 1st NFT 
        let expected_nft_token_address = token::create_token_address(
            &resource_account_address,
            &string::utf8(COLLECTION_NAME),
            &name1,
        );
        
        let nft_token_object = object::address_to_object<token::Token>(expected_nft_token_address);
        assert!(
            object::is_owner(nft_token_object, user_address) == true,
            1
        );
        assert!(
            token::creator(nft_token_object) == resource_account_address,
            4
        );
        assert!(
            token::name(nft_token_object) == name1,
            4
        );
        assert!(
            token::description(nft_token_object) == string::utf8(CHILD_TOKEN_DESC),
            4
        );
        assert!(
            token::uri(nft_token_object) == string::utf8(CHILD_TOKEN_URI),
            4
        );
        // 2nd NFT 
        let expected_nft_token_address2 = token::create_token_address(
            &resource_account_address,
            &string::utf8(COLLECTION_NAME),
            &name2,
        );
        let nft_token_object2 = object::address_to_object<token::Token>(expected_nft_token_address2);
        assert!(
            object::is_owner(nft_token_object2, user_address) == true,
            1
        );
        assert!(
            token::creator(nft_token_object2) == resource_account_address,
            4
        );
        assert!(
            token::name(nft_token_object2) == name2,
            4
        );
        assert!(
            token::description(nft_token_object2) == string::utf8(CHILD_TOKEN_DESC),
            4
        );
        assert!(
            token::uri(nft_token_object2) == string::utf8(CHILD_TOKEN_URI),
            4
        );

        assert!(object::object_exists<Token>(addr1) == false,ENOT_EXISTS);
        assert!(object::object_exists<Token>(addr2) == false,ENOT_EXISTS);


        let state1 = borrow_global<State>(resource_account_address);
        assert!(state1.totalMinted == 4,6);

    }


}