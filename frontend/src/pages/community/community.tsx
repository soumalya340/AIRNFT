import React from "react";
import Nav from "../../components/navbar/Navbar";

const community = () => {
  return (
    <>
      <div className=" bg-orange-200">
        <Nav />
        <div className="mx-auto w-full max-w-screen-xl px-2.5 md:px-10 flex flex-col items-center py-4 relative overflow-x-hidden ">
          <div className="mt-7 w-[90%] mx-auto">
            <div className="bg-black/[0.3] border rounded-[50px] h-[63vh] flex backdrop-blur-sm pl-5 pr-7 mt-7">
              <div className="w-[35%] flex justify-center items-center">
                <img
                  alt="hero"
                  loading="lazy"
                  width="1021"
                  height="1276"
                  decoding="async"
                  data-nimg="1"
                  className=" w-[80%] h-[80%]"
                  src="https://th.wallhaven.cc/lg/l8/l8vp7y.jpg"
                />
              </div>
              <div className=" w-[75%] flex flex-col justify-around items-center">
                <h2 className="text-7xl font-bold">Discover Web3</h2>
                <h3 className="italic text-2xl text-center">
                  Explor Dapp with community solved puzzles.
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#200F00] flex justify-center items-center  space-x-2 rounded-xl p-2 hover:scale-95 transition-taransform duration-300 backdrop-blur-sm shadow-md">
                    <img
                      alt="hero"
                      loading="lazy"
                      width="60"
                      height="60"
                      decoding="async"
                      data-nimg="1"
                      className="p-1"
                      src="https://cdn.discordapp.com/attachments/1106054726543495239/1220959877581504522/shachindra_meeting_friends_stickman_style_minimal_357b70da-6aae-45f6-a7e5-b7e454535851.png?ex=6610d67f&is=65fe617f&hm=74a8160ecf1e0eba14095118c50566473ec7946a3cc9e9786ff58729018d0e19&"
                    />
                    <h2 className="text-[#EFB359]">Meet new friends</h2>
                  </div>

                  <div className="bg-[#200F00] flex justify-center items-center  space-x-2 rounded-xl p-2 hover:scale-95 transition-taransform duration-300 backdrop-blur-sm shadow-md">
                    <img
                      alt="hero"
                      loading="lazy"
                      width="60"
                      height="60"
                      decoding="async"
                      data-nimg="1"
                      className="p-1"
                      src="https://cdn.discordapp.com/attachments/1106054726543495239/1220960055696953374/shachindra_meeting_friends_stickman_style_minimal_20c78761-cde7-48d1-bd81-8223ae4e3346.png?ex=6610d6a9&is=65fe61a9&hm=9486af1046e21643a2a00306f0dbef6bef64eeb1637191a572c9aa5c1c537456&"
                    />
                    <h2 className="text-[#EFB359]">Meet new friends</h2>
                  </div>

                  <div className="bg-[#200F00] flex justify-center items-center  space-x-2 rounded-xl p-2 hover:scale-95 transition-taransform duration-300 backdrop-blur-sm shadow-md">
                    <img
                      alt="hero"
                      loading="lazy"
                      width="60"
                      height="60"
                      decoding="async"
                      data-nimg="1"
                      className="p-1"
                      src="https://cdn.discordapp.com/attachments/1106054726543495239/1220960092887846974/shachindra_meeting_friends_stickman_style_minimal_42575d75-d4c8-4594-a97e-d34f92be29e3.png?ex=6610d6b2&is=65fe61b2&hm=1be963cb19d28a064cb7a6426c43cb4028c9f6405e4790a7499aa78815d85f05&"
                    />
                    <h2 className="text-[#EFB359]">Meet new friends</h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex h-[38vh] my-10 ">
              <section>
                <img
                  alt="hero"
                  loading="lazy"
                  width="868"
                  height="952"
                  decoding="async"
                  data-nimg="1"
                  className="aspect-auto h-full px-8"
                  src="https://th.wallhaven.cc/small/85/858lz1.jpg"
                />
              </section>
              <h2 className="italic text-2xl text-left my-auto font-semibold leading-[4rem]">
                “Get puzzle pieces from time to time or earn them by completing
                a task. But watch out, your time run fast. Make frens to
                complete them, don't be last”
              </h2>
            </div>

            <div className='flex justify-between h-[38vh] my-12"'>
              <a
                className="w-[30%] relative rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.03] transition-transform duration-300"
                href="/user/signup"
              >
                <img
                  alt="promoter"
                  loading="lazy"
                  width="1024"
                  height="1024"
                  decoding="async"
                  data-nimg="1"
                  className="object-cover w-full h-full"
                  src="https://th.wallhaven.cc/small/jx/jxd1x5.jpg"
                />
                <div className="absolute inset-x-0 bottom-4 flex justify-center items-center bg-black rounded-xl w-[80%] mx-auto text-white space-x-2 py-2 opacity-80">
                  <h2 className="uppercase text-lg font-semibold leading-loose">
                    Create Your own Puzzle
                  </h2>
                </div>
                <div className="absolute top-0 left-0 w-full h-full z-10 bg-[#fe8c27] opacity-[0.15] "></div>
              </a>
              <a
                className="w-[30%] relative rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.03] transition-transform duration-300"
                href="/user/signup"
              >
                <img
                  alt="promoter"
                  loading="lazy"
                  width="1024"
                  height="1024"
                  decoding="async"
                  data-nimg="1"
                  className="object-cover w-full h-full"
                  src="https://th.wallhaven.cc/small/jx/jxd1x5.jpg"
                />
                <div className="absolute inset-x-0 bottom-4 flex justify-center items-center bg-black rounded-xl w-[80%] mx-auto text-white space-x-2 py-2 opacity-80">
                  <h2 className="uppercase text-lg font-semibold leading-loose">
                    Start puzzling
                  </h2>
                </div>
                <div className="absolute top-0 left-0 w-full h-full z-10 bg-[#fe8c27] opacity-[0.15] "></div>
              </a>
              <a
                className="w-[30%] relative rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.03] transition-transform duration-300"
                href="/promoter/signup"
              >
                <img
                  alt="promoter"
                  loading="lazy"
                  width="1024"
                  height="1024"
                  decoding="async"
                  data-nimg="1"
                  className="object-cover w-full h-full"
                  src="https://th.wallhaven.cc/small/2y/2y6wwg.jpg"
                />
                <div className="absolute inset-x-0 bottom-4 flex justify-center items-center bg-black rounded-xl w-[80%] mx-auto text-white space-x-2 py-2 opacity-80">
                  <h2 className="uppercase text-lg font-semibold leading-loose">
                    Promoter Project
                  </h2>
                </div>
                <div className="absolute top-0 left-0 w-full h-full z-10 bg-[#fe8c27] opacity-[0.15] "></div>
              </a>
            </div>
            <div className="flex h-[38vh] my-10 ">
              <img
                alt="hero"
                loading="lazy"
                width="808"
                height="920"
                decoding="async"
                data-nimg="1"
                className="aspect-auto h-full  pl-8 pr-16"
                src="https://th.wallhaven.cc/lg/we/werowr.jpg"
              />
              <h2 className="italic text-2xl text-left my-auto font-semibold leading-[4rem]">
                “Don't struggle to get users on your dApp, With a puzzle you'll
                get a ton ASAP, Create a campaign now, easy and fast”
              </h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default community;
