import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { m, AnimatePresence } from 'framer-motion'
import cx from 'classnames'

import { fadeAnim } from '@lib/animate'

import BlockContent from '@components/block-content'
import Icon from '@components/icon'

const Newsletter = ({ data = {} }) => {
  // Extract our module data
  const { id, klaviyoListID, terms, submit, successMsg, errorMsg } = data

  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const {
    handleSubmit,
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm()

  const hasAgreed = watch('acceptTerms')

  // Call to reset the form
  const resetForm = (e) => {
    e.preventDefault()
    reset()
    setError(false)
    setSuccess(false)
    setSubmitting(false)
  }

  // handle form submission
  const onSubmit = (data, e) => {
    e.preventDefault()

    // set an error if there's no Klaviyo list supplied...
    if (!klaviyoListID) setError(true)

    // ...and bail out if terms active and not agreed to (or just Klaviyo list is missing)
    if ((!hasAgreed && terms && !klaviyoListID) || !klaviyoListID) return

    setSubmitting(true)
    setError(false)

    fetch('/api/klaviyo/newsletter-join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        listID: klaviyoListID,
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

  const email = register('email', {
    required: 'This field is required.',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
      message: 'Invalid email address.',
    },
  })

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <AnimatePresence mode="wait">
        {!error && !success && (
          <m.div
            initial="hide"
            animate="show"
            exit="hide"
            variants={fadeAnim}
            className="form--fields"
          >
            <input
              type="text"
              name="fullname"
              autoComplete="off"
              className="control--pot"
              aria-hidden="true"
              {...register('fullname')}
            />
            <div className="control--group is-inline is-clean">
              <div className={`control${errors?.email ? ' has-error' : ''}`}>
                <label htmlFor={`email-${id}`} className="control--label">
                  Email Address
                </label>
                <input
                  id={`email-${id}`}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  ref={email.ref}
                  onFocus={(e) => {
                    e.target.parentNode.classList.add('is-filled')
                  }}
                  onBlur={(e) => {
                    const value = e.target.value
                    email.onBlur(e)
                    e.target.parentNode.classList.toggle('is-filled', value)
                  }}
                  onChange={(e) => {
                    const value = e.target.value
                    email.onChange(e)
                    e.target.parentNode.classList.toggle('is-filled', value)
                  }}
                />

                {errors?.email && (
                  <span role="alert" className="control--error">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className={cx('btn is-text', {
                  'is-loading': submitting,
                  'is-disabled': terms && !hasAgreed,
                })}
                disabled={submitting || (terms && !hasAgreed)}
              >
                {submit ? submit : 'Send'}
              </button>
            </div>

            {terms && (
              <div className="control">
                <input
                  id={`acceptTerms-${id}`}
                  name="acceptTerms"
                  type="checkbox"
                  {...register('acceptTerms')}
                />
                <label
                  htmlFor={`acceptTerms-${id}`}
                  className="control--label for-checkbox mx-auto sm:mx-0"
                >
                  <Icon name="Checkmark" />
                  {terms && <BlockContent blocks={terms} />}
                </label>
              </div>
            )}
          </m.div>
        )}

        {success && (
          <m.div
            key="success"
            initial="hide"
            animate="show"
            exit="hide"
            variants={fadeAnim}
            className="form--success"
          >
            <div className="form--success-content">
              {successMsg ? (
                <BlockContent blocks={successMsg} />
              ) : (
                <h2>Success!</h2>
              )}
            </div>
          </m.div>
        )}

        {error && (
          <m.div
            key="error"
            initial="hide"
            animate="show"
            exit="hide"
            variants={fadeAnim}
            className="form--error"
          >
            <div className="form--error-content">
              {errorMsg ? <BlockContent blocks={errorMsg} /> : <h2>Error!</h2>}
              <p className="form--error-reset">
                <button className="btn" onClick={(e) => resetForm(e)}>
                  try again
                </button>
              </p>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </form>
  )
}

export default Newsletter
