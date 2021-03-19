import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { m, AnimatePresence } from 'framer-motion'

const Waitlist = ({ variant, klaviyo }) => {
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const { handleSubmit, register, reset, errors } = useForm()

  const resetForm = (e) => {
    e.preventDefault()
    reset()
    setError(false)
    setSuccess(false)
    setSubmitting(false)
  }

  const onSubmit = (data, e) => {
    e.preventDefault()

    if (!variant) {
      setError(true)
      return
    }

    setSubmitting(true)
    setError(false)

    fetch('/api/klaviyo/waitlist-join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accountID: klaviyo,
        variant: variant,
        ...data,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setSubmitting(false)
        setSuccess(true)
      })
      .catch((error) => {
        setSubmitting(false)
        setError(true)
        console.log(error)
      })
  }

  const formAnim = {
    show: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: 'linear',
        when: 'beforeChildren',
      },
    },
    hide: {
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: 'linear',
        when: 'afterChildren',
      },
    },
  }

  return (
    <div className="product--waitlist">
      <AnimatePresence exitBeforeEnter initial={false}>
        {!error && !success && (
          <m.form
            key="form"
            initial="hide"
            animate="show"
            exit="hide"
            variants={formAnim}
            className="form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              type="text"
              name="fullname"
              autoComplete="off"
              className="control--pot"
              ref={register}
            />
            <div className="control--group is-inline">
              <div className={`control${errors.email ? ' has-error' : ''}`}>
                <label htmlFor="email" className="control--label">
                  Email Address
                </label>
                <input
                  name="email"
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
                {errors.email && (
                  <span role="alert" className="control--error">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <button
                type="submit"
                className={`btn is-primary is-large is-block${
                  submitting ? ' is-loading' : ''
                }`}
                disabled={submitting}
              >
                {submitting ? 'Wait...' : 'Notify Me'}
              </button>
            </div>
          </m.form>
        )}

        {success && (
          <m.div
            key="success"
            initial="hide"
            animate="show"
            exit="hide"
            variants={formAnim}
            className="form--success"
          >
            <div className="form--success-content">
              Thanks! We'll be in touch.
            </div>
          </m.div>
        )}

        {error && (
          <m.div
            key="error"
            initial="hide"
            animate="show"
            exit="hide"
            variants={formAnim}
            className="form--error"
          >
            <div className="form--error-content">Yikes. That didn’t work!</div>
            <div className="form--error-reset">
              <button className="btn" onClick={(e) => resetForm(e)}>
                Try Again
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Waitlist
