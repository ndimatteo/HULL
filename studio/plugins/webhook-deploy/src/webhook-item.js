import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import ReactPolling from 'react-polling'

import client from 'part:@sanity/base/client'
import Button from 'part:@sanity/components/buttons/default'
import styles from './webhook-item.css'

const webhookItem = ({
  name,
  url,
  id,
  vercelProject,
  vercelToken,
  toggleSnackbar
}) => {
  const [isUpdating, setUpdating] = useState(
    vercelToken && vercelProject ? true : false
  )
  const [isDeploying, setDeploying] = useState(false)
  const [status, setStatus] = useState(false)
  const [project, setProject] = useState(false)

  const statusRef = useRef()
  statusRef.current = false

  useEffect(() => {
    let isSubscribed = true
    if (vercelToken && vercelProject) {
      // get project ID from project name
      const id = getProject(vercelProject)
        .then(res => {
          if (res.data.id) {
            setProject(res.data.id)
          }
        })
        .catch(err => {
          console.log(err)

          setStatus('ERROR')
          statusRef.current = 'ERROR'
          setUpdating(false)
        })

      // get latest project deployment
      if (project) {
        const latest = getLatestDeployment().then(res => {
          if (isSubscribed) {
            const deployment = res.data.deployments[0]

            setUpdating(false)
            setStatus(deployment.state)

            if (status !== 'READY' || status !== 'ERROR') {
              setDeploying(true)
            }
          }
        })
      }
    }

    return () => (isSubscribed = false)
  }, [project])

  useEffect(() => {
    let isSubscribed = true
    if (
      (status === 'READY' || status === 'ERROR') &&
      isSubscribed &&
      vercelToken &&
      vercelProject
    ) {
      setDeploying(false)
    }

    return () => (isSubscribed = false)
  }, [status])

  const getLatestDeployment = async () => {
    const options = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${vercelToken}`
      },
      url: `https://api.vercel.com/v5/now/deployments?projectId=${project}&limit=1`
    }

    return axios(options)
  }

  const getProject = id => {
    const options = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${vercelToken}`
      },
      url: `https://api.vercel.com/v1/projects/${id}`
    }

    return axios(options)
  }

  const onDeploy = (name, url) => {
    setDeploying(true)
    setStatus('INITIATED')

    toggleSnackbar(false)

    global
      .fetch(url, {
        method: 'POST'
      })
      .then(res => {
        toggleSnackbar(true, 'success', 'Success!', `Deployed webhook: ${name}`)
      })
      .catch(err => {
        setDeploying(false)
        toggleSnackbar(true, 'error', 'Deploy Failed', `${err}`)
        console.log(err)
      })
  }

  const onRemove = (name, id) => {
    setUpdating(true)
    client.delete(id).then(res => {
      setUpdating(false)
      toggleSnackbar(
        true,
        'success',
        'Webhook Deleted',
        `Successfully deleted webhook: ${name}`
      )
    })
  }

  return (
    <>
      <div className={styles.hook}>
        <div className={styles.hookDetails}>
          <h4 className={styles.hookTitle}>{name}</h4>
          <p className={styles.hookURL}>{url}</p>
        </div>
        <div className={styles.hookActions}>
          {vercelToken && vercelProject && (
            <div className={styles.hookStatus}>
              {isDeploying ? (
                <ReactPolling
                  url={'custom'}
                  method={'GET'}
                  interval={3000}
                  retryCount={5}
                  onSuccess={res => {
                    const deployment = res.data.deployments[0]
                    // catch if initial deployment hasn't updated yet

                    if (
                      statusRef.current === false &&
                      deployment.state === 'READY'
                    ) {
                      return true
                    }

                    setStatus(deployment.state)
                    statusRef.current = deployment.state

                    return true
                  }}
                  onFailure={err => console.log(err)}
                  promise={getLatestDeployment}
                  render={({ isPolling }) => {
                    if (isPolling) {
                      return (
                        <div>
                          {status ? (
                            <span
                              className={styles.hookStatusIndicator}
                              data-indicator={status}
                            >
                              {titleCase(status)}
                            </span>
                          ) : (
                            <span
                              className={styles.hookStatusIndicator}
                              data-indicator="LOADING"
                            >
                              Loading
                            </span>
                          )}
                        </div>
                      )
                    } else {
                      return (
                        <div
                          className={styles.hookStatusIndicator}
                          data-indicator="INACTIVE"
                        >
                          Status Inactive
                        </div>
                      )
                    }
                  }}
                />
              ) : (
                <>
                  {status ? (
                    <span
                      className={styles.hookStatusIndicator}
                      data-indicator={status}
                    >
                      {titleCase(status)}
                    </span>
                  ) : (
                    <span
                      className={styles.hookStatusIndicator}
                      data-indicator="LOADING"
                    >
                      Loading
                    </span>
                  )}
                </>
              )}
            </div>
          )}
          <Button
            color="success"
            onClick={() => onDeploy(name, url)}
            className={styles.deployButton}
            disabled={isDeploying || isUpdating}
            loading={isDeploying}
            type="button"
          >
            Deploy
          </Button>{' '}
          <Button
            color="danger"
            inverted
            onClick={() => onRemove(name, id)}
            className={styles.deleteButton}
            disabled={isDeploying || isUpdating}
            loading={isUpdating}
            type="button"
          >
            Remove
          </Button>
        </div>
      </div>
    </>
  )
}

const titleCase = str => {
  return str
    .toLowerCase()
    .split(' ')
    .map(function(word) {
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

export default webhookItem
