import appointment_img from './appointment_img.png'
import header_img from './header_img.png'
import group_profiles from './group_profiles.png'
import profile_pic from './profile_pic.png'
import contact_image from './contact_image.png'
import about_image from './about_image.png'
import logo from './logo.svg'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import stripe_logo from './stripe_logo.png'
import razorpay_logo from './razorpay_logo.png'

import doc1 from './doc1.png'
import doc2 from './doc2.png'
import doc3 from './doc3.png'
import doc4 from './doc4.png'
import doc5 from './doc5.png'
import doc6 from './doc6.png'
import doc7 from './doc7.png'
import doc8 from './doc8.png'
import doc9 from './doc9.png'
import doc10 from './doc10.png'
import doc11 from './doc11.png'
import doc12 from './doc12.png'
import doc13 from './doc13.png'
import doc14 from './doc14.png'
import doc15 from './doc15.png'

import Dermatologist from './Dermatologist.svg'
import Gastroenterologist from './Gastroenterologist.svg'
import General_physician from './General_physician.svg'
import Gynecologist from './Gynecologist.svg'
import Neurologist from './Neurologist.svg'
import Pediatricians from './Pediatricians.svg'

export const assets = {
    appointment_img,
    header_img,
    group_profiles,
    logo,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    stripe_logo,
    razorpay_logo
}

export const specialityData = [
    { speciality: 'General physician', image: General_physician },
    { speciality: 'Gynecologist', image: Gynecologist },
    { speciality: 'Dermatologist', image: Dermatologist },
    { speciality: 'Pediatricians', image: Pediatricians },
    { speciality: 'Neurologist', image: Neurologist },
    { speciality: 'Gastroenterologist', image: Gastroenterologist }
]

export const doctors = [

    {
        _id: 'doc1',
        name: 'Dr. Richard James',
        image: doc1,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Richard James specializes in primary healthcare, preventive medicine, and early diagnosis of common illnesses. He focuses on long-term patient wellness and personalized treatment plans.',
        fees: 50,
        address: { line1: '17th Cross, Richmond', line2: 'London' }
    },

    {
        _id: 'doc2',
        name: 'Dr. Emily Larson',
        image: doc2,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Emily Larson provides comprehensive women’s healthcare including prenatal care, reproductive health management, and hormonal treatments with a patient-first approach.',
        fees: 60,
        address: { line1: '27th Cross, Richmond', line2: 'London' }
    },

    {
        _id: 'doc3',
        name: 'Dr. Sarah Patel',
        image: doc3,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Year',
        about: 'Dr. Sarah Patel specializes in skin, hair, and nail disorders. She offers advanced treatments for acne, eczema, pigmentation, and cosmetic dermatology procedures.',
        fees: 30,
        address: { line1: '37th Cross, Richmond', line2: 'London' }
    },

    {
        _id: 'doc4',
        name: 'Dr. Christopher Lee',
        image: doc4,
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Christopher Lee focuses on child healthcare, including vaccinations, developmental monitoring, and treatment of childhood illnesses in a safe environment.',
        fees: 40,
        address: { line1: '47th Cross, Richmond', line2: 'London' }
    },

    {
        _id: 'doc5',
        name: 'Dr. Jennifer Garcia',
        image: doc5,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Jennifer Garcia specializes in neurological disorders such as migraines, epilepsy, stroke management, and nerve-related conditions.',
        fees: 50,
        address: { line1: '57th Cross, Richmond', line2: 'London' }
    },

    {
        _id: 'doc6',
        name: 'Dr. Andrew Williams',
        image: doc6,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Andrew Williams provides expert diagnosis and management of brain and nerve disorders with modern neurological treatment approaches.',
        fees: 50,
        address: { line1: '57th Cross, Richmond', line2: 'London' }
    },

    {
        _id: 'doc7',
        name: 'Dr. Christopher Davis',
        image: doc7,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Christopher Davis delivers comprehensive general medical care, focusing on prevention, chronic disease management, and lifestyle guidance.',
        fees: 50,
        address: { line1: '17th Cross, Richmond', line2: 'London' }
    },

    {
        _id: 'doc8',
        name: 'Dr. Timothy White',
        image: doc8,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Timothy White specializes in women’s reproductive health and offers compassionate and confidential gynecological care.',
        fees: 60,
        address: { line1: '27th Cross, Richmond', line2: 'London' }
    },

    {
        _id: 'doc9',
        name: 'Dr. Ava Mitchell',
        image: doc9,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Year',
        about: 'Dr. Ava Mitchell focuses on advanced skin treatments and aesthetic dermatology solutions for healthier skin.',
        fees: 30,
        address: { line1: '37th Cross, Richmond', line2: 'London' }
    },

    {
        _id: 'doc10',
        name: 'Dr. Jeffrey King',
        image: doc10,
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Jeffrey King ensures child wellness through preventive care, regular monitoring, and early detection of pediatric conditions.',
        fees: 40,
        address: { line1: '47th Cross, Richmond', line2: 'London' }
    },

    {
        _id: 'doc11',
        name: 'Dr. Zoe Kelly',
        image: doc11,
        speciality: 'Gastroenterologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Zoe Kelly specializes in treating neurological disorders with advanced diagnostics and evidence-based care.',
        fees: 50,
        address: { line1: '57th Cross, Richmond', line2: 'London' }
    },

    {
        _id: 'doc12',
        name: 'Dr. Patrick Harris',
        image: doc12,
        speciality: 'Gastroenterologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Patrick Harris focuses on brain and nervous system disorders, providing comprehensive neurological care.',
        fees: 50,
        address: { line1: '57th Cross, Richmond', line2: 'London' }
    },

    {
        _id: 'doc13',
        name: 'Dr. Chloe Evans',
        image: doc13,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Chloe Evans provides holistic medical care, focusing on long-term patient health and preventive strategies.',
        fees: 50,
        address: { line1: '17th Cross, Richmond', line2: 'London' }
    },

    {
        _id: 'doc14',
        name: 'Dr. Ryan Martinez',
        image: doc14,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Ryan Martinez offers expert gynecological consultations and reproductive health treatments.',
        fees: 60,
        address: { line1: '27th Cross, Richmond', line2: 'London' }
    },

    {
        _id: 'doc15',
        name: 'Dr. Amelia Hill',
        image: doc15,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Year',
        about: 'Dr. Amelia Hill specializes in skin care treatments and modern dermatological procedures.',
        fees: 30,
        address: { line1: '37th Cross, Richmond', line2: 'London' }
    }

]
