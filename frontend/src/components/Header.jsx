import React from 'react';
import { assets } from '../assets/assets_frontend/assets';

function Header() {
    return (
        <div className='flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-6 md:px-10 lg:px-20 mt-5'>

            {/* Left Section */}
            <div className='md:w-1/2 flex flex-col items-start justify-center gap-6 py-10 md:py-[10vw] md:mb-[-3px]'>

                <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight'>
                    Book Appointment <br />
                    with Trusted Doctors
                </p>

                <div className='flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light'>
                    <img className='w-28' src={assets.group_profiles} alt='grp' />
                    <p>
                        Simply browse through our extensive list of trusted doctors,
                        <br className="hidden sm:block" />
                        schedule your appointment for free
                    </p>
                </div>

                <a 
                    href="#speciality" 
                    className='flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-full font-medium hover:scale-105 transition'
                >
                    Book Appointment
                    <img src={assets.arrow_icon} alt="icon" className="w-4" />
                </a>

            </div>

            {/* Right Section */}
            <div className='md:w-1/2 relative'>
                <img 
                    className='w-full md:absolute bottom-0 h-auto rounded-lg'
                    src={assets.header_img} 
                    alt="header"
                />
            </div>

        </div>
    );
}

export default Header;
