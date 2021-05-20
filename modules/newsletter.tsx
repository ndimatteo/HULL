import * as React from 'react'
import { useForm } from 'react-hook-form'
import { m, AnimatePresence } from 'framer-motion'
import cx from 'classnames'
import BlockContent from '@sanity/block-content-to-react'
import { serializers } from '@/lib/serializers'
import { fadeAnim } from '@/lib/animate'
import Icon from '@/components/icon'
import { ComplexPortableText, SimplePortableText } from '@/lib/shared-types'

type NewsletterProps = {
  data: {
    id?: string
    klaviyoListID?: string
    terms?: string
    submit?: SimplePortableText
    successMsg?: ComplexPortableText
    errorMsg?: ComplexPortableText
  }
}

const Newsletter = ({ data }: NewsletterProps) => {
  // Extract our module data
  const { id, klaviyoListID, terms, submit, successMsg, errorMsg } = data

  const [submitting, setSubmitting] = React.useState<boolean>(false)
  const [success, setSuccess] = React.useState<boolean>(false)
  const [error, setError] = React.useState<boolean>(false)
  const { handleSubmit, register, watch, reset, errors } = useForm()

  const hasAgreed = !!watch('acceptTerms')

  // Call to reset the form
  const resetForm = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => () => {
      e.preventDefault()
      reset()
      setError(false)
      setSuccess(false)
      setSubmitting(false)
    },
    [reset, setError, setSuccess, setSubmitting]
  )

  // handle form submission
  const onSubmit = React.useCallback(
    (data: any, e: React.BaseSyntheticEvent<object, any, any> | undefined) => {
      e?.preventDefault()

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
        .then((_res) => {
          setSubmitting(false)
          setSuccess(true)
        })
        .catch((error) => {
          setSubmitting(false)
          setError(true)
          console.log(error)
        })
    },
    [klaviyoListID, hasAgreed, terms, setError, setSuccess, setSubmitting]
  )

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <AnimatePresence exitBeforeEnter>
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
              ref={register}
            />
            <div className="control--group is-inline is-clean">
              <div className={`control${errors.email ? ' has-error' : ''}`}>
                <label htmlFor={`email-${id}`} className="control--label">
                  Email Address
                </label>
                <input
                  id={`email-${id}`}
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
                    // @ts-expect-error
                    e.target.parentNode.classList.add('is-filled')
                  }}
                  onBlur={(e) => {
                    const value = e.target.value // @ts-expect-error
                    e.target.parentNode.classList.toggle('is-filled', value)
                  }}
                  onChange={(e) => {
                    const value = e.target.value // @ts-expect-error
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
                className={cx('btn is-primary', {
                  'is-loading': submitting,
                  'is-disabled': terms && !hasAgreed,
                })}
                disabled={submitting || (terms ? !hasAgreed : undefined)}
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
                  ref={register}
                />
                <label
                  htmlFor={`acceptTerms-${id}`}
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
                <button className="btn" onClick={resetForm}>
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
