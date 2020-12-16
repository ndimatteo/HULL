import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'

import BlockContent from '@sanity/block-content-to-react'
import { serializers } from '.'

import Icon from '../components/icon'

const FormNewsletter = ({ data }) => {
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const { handleSubmit, register, watch, reset, errors } = useForm()

  const hasAgreed = watch('agreeToTerms')

  const { klaviyoListID, terms, submit, successMsg, errorMsg } = data

  const resetForm = (e) => {
    e.preventDefault()
    reset()
    setError(false)
    setSuccess(false)
    setSubmitting(false)
  }

  const onSubmit = (data, e) => {
    e.preventDefault()

    if (!klaviyoListID) {
      setError(true)
    }

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
    <section className="section border-b">
      <div className="section--wrapper">
        <div className="section--content text-center">
          <h2 className="mb-8 font-serif text-7xl">The Newsletter</h2>
          <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence exitBeforeEnter>
              {!error && !success && (
                <motion.div
                  key="form"
                  initial="hide"
                  animate="show"
                  exit="hide"
                  variants={formAnim}
                  className="form--fields"
                >
                  <div className="control--group">
                    <div
                      className={`control${errors.fname ? ' has-error' : ''}`}
                    >
                      <input
                        type="text"
                        name="fullname"
                        autoComplete="off"
                        className="control--pot"
                        ref={register}
                      />
                      <label htmlFor="fname" className="control--label">
                        First Name
                      </label>
                      <input
                        name="fname"
                        type="text"
                        autoComplete="given-name"
                        ref={register({
                          required: 'This field is required.',
                        })}
                        onFocus={(e) => {
                          e.target.parentNode.classList.add('is-filled')
                        }}
                        onBlur={(e) => {
                          const value = e.target.value
                          e.target.parentNode.classList.toggle(
                            'is-filled',
                            value
                          )
                        }}
                        onChange={(e) => {
                          const value = e.target.value
                          e.target.parentNode.classList.toggle(
                            'is-filled',
                            value
                          )
                        }}
                      />
                      {errors.fname && (
                        <span role="alert" className="control--error">
                          {errors.fname.message}
                        </span>
                      )}
                    </div>
                    <div
                      className={`control${errors.lname ? ' has-error' : ''}`}
                    >
                      <label htmlFor="lname" className="control--label">
                        Last Name
                      </label>
                      <input
                        name="lname"
                        type="text"
                        autoComplete="family-name"
                        ref={register({
                          required: 'This field is required.',
                        })}
                        onFocus={(e) => {
                          e.target.parentNode.classList.add('is-filled')
                        }}
                        onBlur={(e) => {
                          const value = e.target.value
                          e.target.parentNode.classList.toggle(
                            'is-filled',
                            value
                          )
                        }}
                        onChange={(e) => {
                          const value = e.target.value
                          e.target.parentNode.classList.toggle(
                            'is-filled',
                            value
                          )
                        }}
                      />
                      {errors.lname && (
                        <span role="alert" className="control--error">
                          {errors.lname.message}
                        </span>
                      )}
                    </div>
                  </div>
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
                  {terms && (
                    <div className="control">
                      <input
                        name="agreeToTerms"
                        id="agreeToTerms"
                        type="checkbox"
                        ref={register}
                      />
                      <label
                        htmlFor="agreeToTerms"
                        className="control--label for-checkbox"
                      >
                        <Icon name="Checkmark" />
                        {terms && (
                          <BlockContent
                            renderContainerOnSingleChild
                            className="rc"
                            blocks={terms}
                            serializers={serializers}
                          />
                        )}
                      </label>
                    </div>
                  )}
                  <button
                    type="submit"
                    className={`btn is-block${submitting ? ' is-loading' : ''}${
                      !hasAgreed && terms ? ' is-disabled' : ''
                    }`}
                    disabled={submitting || (!hasAgreed && terms)}
                  >
                    {submitting ? 'wait...' : <>{submit ? submit : 'Submit'}</>}
                  </button>
                </motion.div>
              )}

              {success && (
                <motion.div
                  key="success"
                  initial="hide"
                  animate="show"
                  exit="hide"
                  variants={formAnim}
                  className="form--success"
                >
                  <div className="form--success-content">
                    {successMsg ? (
                      <BlockContent
                        renderContainerOnSingleChild
                        className="rc"
                        blocks={successMsg}
                        serializers={serializers}
                      />
                    ) : (
                      <h2>Success!</h2>
                    )}
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  key="error"
                  initial="hide"
                  animate="show"
                  exit="hide"
                  variants={formAnim}
                  className="form--error"
                >
                  <div className="form--error-content">
                    {errorMsg ? (
                      <BlockContent
                        renderContainerOnSingleChild
                        className="rc"
                        blocks={errorMsg}
                        serializers={serializers}
                      />
                    ) : (
                      <h2>Error!</h2>
                    )}
                    <p className="form--error-reset">
                      <button className="btn" onClick={(e) => resetForm(e)}>
                        try again
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </section>
  )
}

export default FormNewsletter
