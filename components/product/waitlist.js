import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import astrochimp from 'astrochimp'

const Waitlist = ({ variant, submit }) => {
  const [submitting, setSubmitting] = useState(false)
  const { handleSubmit, register, watch, reset, errors } = useForm()

  return (
    <div className="product--waitlist">
      <form className="form">
        <input
          type="text"
          name="show"
          className="control--pot"
          ref={register}
        />
        <div className="control--group is-inline">
          <div className={`control${errors.EMAIL ? ' has-error' : ''}`}>
            <label htmlFor="EMAIL" className="control--label">
              Email Address
            </label>
            <input
              name="EMAIL"
              type="email"
              inputMode="email"
              autoComplete="email"
              ref={register({
                required: 'This field is required.',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: 'invalid email address',
                },
              })}
              onFocus={(e) => {
                e.target.parentNode.classList.add('is-filled')
              }}
              onBlur={(e) => {
                const value = e.target.value
                e.target.parentNode.classList.toggle('is-filled', value)
              }}
              onChange={(e) => {
                const value = e.target.value
                e.target.parentNode.classList.toggle('is-filled', value)
              }}
            />
            {errors.EMAIL && (
              <span role="alert" className="control--error">
                {errors.EMAIL.message}
              </span>
            )}
          </div>
          <button
            type="submit"
            className={`btn is-block${submitting ? ' is-loading' : ''}`}
            disabled={submitting}
          >
            {submitting ? (
              'processing...'
            ) : (
              <>{submit ? submit : 'Notify Me'}</>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Waitlist
