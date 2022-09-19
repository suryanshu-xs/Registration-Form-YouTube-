import React, { useState } from 'react'
import profileIcon from '../assets/profile_icon.svg'
import { BsFillCameraFill } from 'react-icons/bs'
import toast, { Toaster } from 'react-hot-toast';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { collection, addDoc } from "firebase/firestore";

const Form = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNo, setPhoneNo] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [avatarImageSrc, setAvatarImageSrc] = useState('')
    const [image, setImage] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const handleAvatarChange = (e) => {
        setImage(e.target.files[0])
        setAvatarImageSrc(URL.createObjectURL(e.target.files[0]))
    }
    const handleSubmitButtonClick = () => {
        if (avatarImageSrc === '') {
            toast.dismiss()
            toast.error("Please select an image.")
        }
    }
    const handleFormSubmit = (event) => {
        event.preventDefault()
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.")
        }
        setIsProcessing(true)
        toast.success("Submitting details....")
        const storageRef = ref(storage, `${email}/${image.name}`)
        const uploadTask = uploadBytesResumable(storageRef, image)
        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        }, () => {
            toast.error("Error Occurred While Submitting Details.")
            setIsProcessing(false)
        }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                addDetails(downloadURL)
            })
        })
        setIsProcessing(false)
    }
    const addDetails = async (profileImage_url) => {
        await addDoc(collection(db, "registration-form-details"), {
            name, email, password, phoneNo, profileImage: profileImage_url
        });
        setIsProcessing(false)
        toast.dismiss()
        toast.success("Details submitted successfully.")
        setName('')
        setEmail('')
        setPhoneNo('')
        setPassword('')
        setConfirmPassword('')
        setAvatarImageSrc('')
        setImage('')
    }
    return (
        <form className='form-wrapper' onSubmit={handleFormSubmit} >
            <div className='form-header' >
                <div className='form-header-image-container' >
                    {
                        avatarImageSrc ?
                            <img src={avatarImageSrc} alt="" />
                            :
                            <img src={profileIcon} alt="" />
                    }
                    <div className='image-input-container' >
                        <label htmlFor="inputTag">
                            <BsFillCameraFill />
                            <input id="inputTag" required onChange={handleAvatarChange} type="file" />
                            <span id="image-input-span"></span>
                        </label>
                    </div>
                </div>
            </div>
            <div className='form-body-container' >
                <div className='input-field-container' >
                    <p>NAME</p>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className='input-field-container' >
                    <p>EMAIL</p>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className='input-field-container' >
                    <p>PHONE NO.</p>
                    <input
                        type="text"
                        required
                        value={phoneNo}
                        onChange={(e) => setPhoneNo(e.target.value.replace(/\D/g, ''))}
                    />
                </div>
                <div className='input-field-container' >
                    <p>PASSWORD</p>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className='input-field-container' >
                    <p>CONFIRM PASSWORD</p>
                    <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <div className='submit-button-container' >
                    <button disabled={isProcessing} type='submit' onClick={handleSubmitButtonClick} >SUBMIT</button>
                </div>
            </div>
            <Toaster />
        </form>
    )
}

export default Form