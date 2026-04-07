import React from "react"
import useGlobalReducer from "../hooks/useGlobalReducer"

export const ContactUs = () => {
    const { store, dispatch } = useGlobalReducer

    return (
        <>
            <div className="container text-center">
                <h1 className="display-3">Contact Us</h1>
            </div>
            <form className="container">
                <div className="form-group">
                    <label for="exampleInputEmail1" className="mt-2 mb-2">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" required />
                </div>
                <div className="form-group">
                    <label for="name" className="form-label mt-2 mb-2">Full Name</label>
                    <input type="text" className="form-control" id="name" placeholder="Enter first and last name" required />
                </div>
                <div className="form-group">
                    <label for="exampleFormControlTextarea1" className="mt-2 mb-2">Query</label>
                    <textarea className="form-control" id="exampleFormControlTextarea1" rows="4" required></textarea>
                </div>
                <button type="submit" className="btn btn-primary mt-3">Submit</button>
            </form>
        </>
    )
}