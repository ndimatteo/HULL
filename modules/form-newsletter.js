import React, { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import astrochimp from 'astrochimp'
import { motion, AnimatePresence } from 'framer-motion'
import sscroll from 'sscroll'

import BlockContent from '@sanity/block-content-to-react'
import { serializers } from '.'

import Icon from '../components/icon'

const FormNewsletter = ({ data }) => {
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const { handleSubmit, register, watch, reset, errors } = useForm()
  const formRef = useRef()

  const hasAgreed = watch('agreeToTerms')

  const { action, terms, submit, successMsg, errorMsg } = data

  const resetForm = (e) => {
    e.preventDefault()
    reset()
    setError(false)
    setSuccess(false)
    setSubmitting(false)
  }

  const scrollToForm = () => {
    if (typeof window !== `undefined` && typeof document !== `undefined`) {
      const offset = document.querySelector('.header').getBoundingClientRect()
        .height
      sscroll(formRef.current, {
        duration: 400,
        offset: -(offset + 20),
      })
    }
  }

  const onSubmit = (data, e) => {
    e.preventDefault()

    if (!action) {
      setError(true)
    }

    if ((!hasAgreed && terms && !action) || !action) return

    setSubmitting(true)
    setError(false)

    astrochimp(action, data, (err, data) => {
      setSubmitting(false)
      if (err) {
        setError(true)
      } else {
        setSuccess(true)
      }
      scrollToForm()
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
    <section className="section" ref={formRef}>
      <div className="section--wrapper">
        <div className="section--content">
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
                      className={`control${errors.FNAME ? ' has-error' : ''}`}
                    >
                      <input
                        type="text"
                        name="show"
                        className="control--pot"
                        ref={register}
                      />
                      <label htmlFor="FNAME" className="control--label">
                        First Name
                      </label>
                      <input
                        name="FNAME"
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
                      {errors.FNAME && (
                        <span role="alert" className="control--error">
                          {errors.FNAME.message}
                        </span>
                      )}
                    </div>
                    <div
                      className={`control${errors.LNAME ? ' has-error' : ''}`}
                    >
                      <label htmlFor="LNAME" className="control--label">
                        Last Name
                      </label>
                      <input
                        name="LNAME"
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
                      {errors.LNAME && (
                        <span role="alert" className="control--error">
                          {errors.LNAME.message}
                        </span>
                      )}
                    </div>
                  </div>
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
                  <div className="form--success-inner">
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
                  <div className="form--error-inner">
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
