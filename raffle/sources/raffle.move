module addrx::raffle {
    use std::signer;
    use std::vector;
    use std::timestamp;
    use aptos_framework::randomness;
    use aptos_framework::event;

    const ENOT_EXIST: u64 = 1;
    const ENOT_IN_WHITELIST: u64 = 2;
    const ERAFFLE_IS_ALREADY_COMPLETED: u64 = 3;
    const ERAFFLE_IS_NOT_COMPLETED: u64 = 4;

    struct Raffle has key {
        game_admin: address,
        players: vector<address>,
        whitelist: vector<address>,
        ending_time: u64,
        completion_status: bool,
        winner: address,
    }

    #[event]
    struct NewGameCreatedEvent has drop,store {
        raffle_owner: address,
        end_time: u64,
    }
    #[event]
    struct NewRaffleBidderEvent has drop,store {
        player: address,
    }
    #[event]
    struct RaffleWinnerEvent has drop,store {
        winner: address,
    }

    public entry fun initialize_game(user: &signer, end_time: u64) {
        let creator_address = signer::address_of(user);
        let t = timestamp::now_seconds() + end_time;
        move_to(user, Raffle {
            game_admin: creator_address,
            players: vector::empty(),
            whitelist: vector::empty(),
            ending_time: t,
            completion_status: false,
            winner: @0x0,
        });
        let event = NewGameCreatedEvent {
            raffle_owner: creator_address,
            end_time: t,
        };
        event::emit(event);
    }

    public entry fun add_to_whitelist(user: &signer, players_list: vector<address>) acquires Raffle {
        let user_address = signer::address_of(user);
        let raffle = borrow_global_mut<Raffle>(user_address);
        vector::append(&mut raffle.whitelist, players_list);
    }

    public entry fun bid(user: &signer) acquires Raffle {
        let user_address = signer::address_of(user);
        let raffle = borrow_global_mut<Raffle>(user_address);
        assert!(vector::contains(&raffle.whitelist, &user_address), ENOT_IN_WHITELIST);
        vector::push_back(&mut raffle.players, user_address);
        let event = NewRaffleBidderEvent {
            player: user_address,
        };
        event::emit(event);
    }

    public fun winner_callout() acquires Raffle {
        let raffle = borrow_global_mut<Raffle>(@addrx);
        assert!(raffle.ending_time <= timestamp::now_seconds(), ERAFFLE_IS_NOT_COMPLETED);
        let length = vector::length(&raffle.players);
        let winner_id = generate_winner(length);
        let winner_address = vector::borrow(&raffle.players, winner_id);

        raffle.winner = *winner_address;
        raffle.completion_status = true;

        let event = RaffleWinnerEvent {
            winner: *winner_address,
        };
        event::emit(event);
    }

    public entry fun winner_pickup() acquires Raffle {
        winner_callout();
    }

    inline fun generate_winner(length: u64): u64 {
        randomness::u64_range(0, length - 1)
    }

    inline fun assert_raffle_status() acquires Raffle {
        assert!(exists<Raffle>(@addrx), ENOT_EXIST);
    }

    #[view]
    public fun get_the_winner(): address acquires Raffle {
        let raffle = borrow_global<Raffle>(@addrx);
        raffle.winner
    }
}
