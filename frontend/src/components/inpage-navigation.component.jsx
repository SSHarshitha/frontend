import { act } from "react";
import { useState,useRef,useEffect } from "react";
export let activeTabLineref;
export let activeTabRef;


const InpageNavigation =({ routes,defaultHidden=[ ],defalutactiveIndex =0,children }) =>{

     activeTabLineref =useRef();
     activeTabRef =useRef();    

    let [inPageNavIndex,setInpageNavIndex]= useState(defalutactiveIndex);


    const changePageState =(btn, i)=>{
        let { offsetWidth, offsetLeft }=btn;
        activeTabLineref.current.style.width=offsetWidth + "px";
        activeTabLineref.current.style.left=offsetLeft + "px";

        setInpageNavIndex(i);
    }

    useEffect(()=>{
        changePageState (activeTabRef.current ,defalutactiveIndex)
    },[])

    return(
        <>
        <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
            {
                routes.map((route,i)=>{
                    return (
                        <button 
                        ref={i == defalutactiveIndex ? activeTabRef : null }
                        key={i} 
                        className={"p-4 px-5 capitalize " + ( inPageNavIndex == i ? "text-black " :"text-dark-grey " ) + ( defaultHidden.includes(route) ? " md:hidden ": " ")} 
                        onClick={(e)=>{changePageState(e.target,i )}}>
                            {route}
                        </button>
                     )
                })
            }

            <hr ref ={activeTabLineref} className="absolute bottom-0 duration-300" />
        </div>

        <div>

        </div>

        {Array.isArray(children)? children[inPageNavIndex] : children}
        </>
    );
}
export default InpageNavigation;