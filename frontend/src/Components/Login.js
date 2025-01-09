const Login=()=>{
    return(
        <div>
            <div className=" w-screen absolute bg-gray-700" >
            <div className="bg-gray-700 p-5">
                <h1 className=" text-white font-bold text-2xl text-center">Campus Chats</h1>
            </div>
            <div >
                <img alt="background pic" className="w-screen " src="https://raw.githubusercontent.com/kishore881/Campus-Chats/656df99ec41baf8e31bc03beaed2e136573fdd1d/FE/src/assets/background.svg"/>
            <  footer className="bg-gray-700  flex flex-wrap justify-around text-white ">
            <div className="my-4"> In case of any issues drop an email at <a href="mailto:campuschats@outlook.com" target="_blank" rel="noreferrer"><strong className="text-teal-500">campuschats@outlook.com</strong></a></div>
                <div className="my-4"> - View on <a href="https://github.com/MadhuriGali/campus-chat" target="_blank" rel="noreferrer"><strong className="text-teal-500">GitHub</strong></a></div>
            </footer>
            </div>
        </div>
        <div className="absolute pt-60 px-48">
        <h3 className="text-black font-semibold text-7xl">Campus Chats</h3>
           <ul className="list-disc pt-3">
           <li className="px-3 m-3 text-2xl"><h5>Join and share things with your college community</h5></li>
            <li className="px-3 m-3 text-2xl"><h5>See what's going on in your campus online and offline</h5></li>
           </ul>
        </div>

        </div>
            
    )
}
export default Login;
