import * as React from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { m, AnimatePresence } from 'framer-motion'

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

type WaitlistProps = {
  variant?: string
  klaviyoAccountID: string
}

const Waitlist = ({ variant, klaviyoAccountID }: WaitlistProps) => {
  const [submitting, setSubmitting] = React.useState<boolean>(false)
  const [success, setSuccess] = React.useState<boolean>(false)
  const [error, setError] = React.useState<boolean>(false)
  const { handleSubmit, register, reset, errors } = useForm()

  const resetForm = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault()
      reset()
      setError(false)
      setSuccess(false)
      setSubmitting(false)
    },
    [reset, setError, setSuccess, setSubmitting]
  )

  const onSubmit = React.useCallback(
    (data: any, e: React.BaseSyntheticEvent<object, any, any> | undefined) => {
      e?.preventDefault()

      if (!variant) {
        setError(true)
        return
      }

      setSubmitting(true)
      setError(false)

      axios
        .post('/api/klaviyo/waitlist-join', {
          accountID: klaviyoAccountID,
          variant: variant,
          ...data,
        })
        .then(() => {
          setSubmitting(false)
          setSuccess(true)
        })
        .catch((error) => {
          setSubmitting(false)
          setError(true)
          console.log(error)
        })
    },
    [variant, setSubmitting, setSuccess, setError]
  )

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
                    // @ts-ignore TODO: find out why parentNode doesn't have classlist
                    e.target.parentNode?.classList.add('is-filled')
                  }}
                  onBlur={(e) => {
                    // @ts-ignore
                    e.target.parentNode?.classList.toggle(
                      'is-filled',
                      e.target.value
                    )
                  }}
                  onChange={(e) => {
                    // @ts-ignore
                    e.target.parentNode?.classList.toggle(
                      'is-filled',
                      e.target.value
                    )
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
