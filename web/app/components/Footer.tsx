"use client";

import { useEffect, useState } from 'react';
import React from "react";
import Link from "next/link";





const Footer = () => {

    return (
        <footer className=" bg-whitemt-10">
            <div className="text-black max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm py-10" >

             
                <div>
                    <h4 className=" mb-3">About Us</h4>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:underline">Our Story</a></li>
                        <li><a href="#" className="hover:underline">Mission & Vision</a></li>
                        <li><a href="#" className="hover:underline">Leadership</a></li>
                    </ul>
                </div>

             
                <div className="font-geist">
                    <ul className="text-[18px] font-semibold space-y-2">
                        <li><a href="#" className="hover:underline">Home</a></li>
                        <li><a href="#" className="hover:underline">About</a></li>
                        <li><a href="#" className="hover:underline">Competitions</a></li>
                        <li><a href="#" className="hover:underline">News</a></li>
                        
                    </ul>
                </div>

            
                <div className="font-geist">
                    <h4 className="font-semibold mb-3">Follow Us</h4>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:underline">FAQs</a></li>
                        <li><a href="#" className="hover:underline">Contact Us</a></li>
                        <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                    </ul>
                </div>

              
                <div className="font-geist">
                    <h4 className="font-semibold mb-3">Contact Us</h4>
                    <p className="mb-2">pilipinastaekwondo@gmail.com</p>
                    <p>+63 912 345 6789</p>
                    
                </div>

            </div>

            <div className='bg-foreground text-white mt-8 md:mt-10 text-center text-sm font-light py-2 md:py-4 font-geist '>
                <div><p>© Copyright 2025  Pilipinas Taekwondo Incorporated. All Rights Reserved </p> </div>

            </div>
        </footer>
    );
};
export default Footer;