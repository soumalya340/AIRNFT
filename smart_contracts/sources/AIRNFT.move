module addrx::cool_kitchen {
    use aptos_framework::object::{Self,Object,ExtendRef};
    use aptos_token_objects::aptos_token::{Self, AptosToken};
    use std::string;
    use std::signer;
    use std::bcs;

    const COLLECTION_NAME: vector<u8> = b"AIRNFT";
    const ENOT_OWNER: u64 = 1;
    
    struct AirnftCollectionCreator has key {    
        extend_ref: ExtendRef
    }

    fun init_module(cafe_signer: &signer) {
        let creator_constructor_ref = &object::create_object(@addrx);
        let extend_ref = object::generate_extend_ref(creator_constructor_ref);
        move_to(cafe_signer, AirnftCollectionCreator { extend_ref });
        let creator_signer = &object::generate_signer(creator_constructor_ref);

        aptos_token::create_collection(
            creator_signer,
            string::utf8(b"Airnt's are awesome"),
            1000,
            string::utf8(COLLECTION_NAME),
            string::utf8(b""),
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            0, 100,
      );
    }
    
    public entry fun create_spider(owner: address, dna: u64) acquires AirnftCollectionCreator {
        let creator_extend_ref = &borrow_global<AirnftCollectionCreator>(@addrx).extend_ref;
        let creator = &object::generate_signer_for_extending(creator_extend_ref);

        let dna_bytes = bcs::to_bytes(&dna);
        let spider_token = aptos_token::mint_token_object(
            creator,
            string::utf8(COLLECTION_NAME),
            string::utf8(b"AIRNFT"),
            string::utf8(b"AIRNFT"),
            string::utf8(b"https://cloudflare-ipfs.com/ipfs/bafkreieg7fiqrdewawpincefabi42mwr2tzcrn6kt6mlwkdvufrzobjkqu"),
            vector[string::utf8(b"dna")],
            vector[string::utf8(b"4")],
            vector[dna_bytes],
      );
      object::transfer(creator, spider_token, owner);
    }

     public entry fun delete_spider(airnft: Object<AptosToken>) acquires AirCollectionCreator {
        let creator_extend_ref = &borrow_global<AirnftCollectionCreator>(@addrx).extend_ref;
        let creator = &object::generate_signer_for_extending(creator_extend_ref);
        aptos_token::burn(creator, spider);
    }

}