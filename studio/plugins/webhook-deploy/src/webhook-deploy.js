import React from 'react'
import client from 'part:@sanity/base/client'
import WebhookItem from './webhook-item'

import Snackbar from 'part:@sanity/components/snackbar/default'
import DefaultDialog from 'part:@sanity/components/dialogs/default'
import DialogContent from 'part:@sanity/components/dialogs/content'
import DefaultTextField from '@sanity/components/lib/textfields/DefaultTextField'
import AnchorButton from 'part:@sanity/components/buttons/anchor'

import styles from './webhook-deploy.css'

const WEBHOOK_TYPE = 'webhook_deploy'
const WEBHOOK_QUERY = `*[_type == "${WEBHOOK_TYPE}"] | order(_createdAt)`

export default class Deploy extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      webhooks: [],
      isUpdating: false,
      isDeploying: false,
      openDialog: false,
      pendingWebhookTitle: '',
      pendingWebhookURL: '',
      pendingVercelProject: '',
      pendingVercelToken: '',
      snackbar: {
        active: false,
        kind: '',
        title: '',
        message: ''
      }
    }
  }

  componentDidMount = () => {
    // Fetch initial
    this.fetchAllWebhooks()

    // Listen to new stuff
    this.webhookSubscription = client
      .listen(WEBHOOK_QUERY, {}, { includeResult: true })
      .subscribe(res => {
        const wasCreated = res.mutations.some(item =>
          item.hasOwnProperty('create')
        )
        const wasDeleted = res.mutations.some(item =>
          item.hasOwnProperty('delete')
        )
        if (wasCreated) {
          this.setState({
            webhooks: [...this.state.webhooks, res.result]
          })
        }
        if (wasDeleted) {
          const newHooks = this.state.webhooks.filter(
            hook => hook._id !== res.documentId
          )
          this.setState({
            webhooks: newHooks
          })
        }
      })
  }

  componentWillUnmount = () => {
    this.webhookSubscription && this.webhookSubscription.unsubscribe()
  }

  fetchAllWebhooks = () => {
    client.fetch(WEBHOOK_QUERY).then(webhooks => {
      this.setState({ webhooks })
    })
  }

  setFormValue = (key, value) => {
    this.setState({
      [key]: value
    })
  }

  onSubmit = () => {
    client
      .create({
        _type: WEBHOOK_TYPE,
        name: this.state.pendingWebhookTitle,
        url: this.state.pendingWebhookURL,
        vercelProject: this.state.pendingVercelProject,
        vercelToken: this.state.pendingVercelToken
      })
      .then(() => {
        this.setState({
          pendingWebhookTitle: '',
          pendingWebhookURL: '',
          pendingVercelProject: '',
          pendingVercelToken: '',
          openDialog: false
        })
        this.toggleSnackbar(
          true,
          'success',
          'Success!',
          `Created webhook: ${name}`
        )
      })
  }

  toggleDialog = state => {
    this.setState({
      openDialog: state
    })
  }

  handleAction = (action, event) => {
    if (action.key === 'create') {
      this.onSubmit()
    } else {
      this.setState({
        openDialog: false
      })
    }
  }

  toggleSnackbar = (state, kind, title, message) => {
    this.setState({
      snackbar: {
        active: state,
        kind: kind,
        title: title,
        message: message
      }
    })
  }

  resetSnackbar = () => {
    this.setState({
      snackbar: { active: false }
    })
  }

  render() {
    const webhookList = this.state.webhooks.map(hook => (
      <WebhookItem
        key={hook._id}
        name={hook.name}
        url={hook.url}
        id={hook._id}
        vercelProject={hook.vercelProject}
        vercelToken={hook.vercelToken}
        toggleSnackbar={this.toggleSnackbar}
      />
    ))

    const actions = [
      {
        key: 'create',
        index: 1,
        title: 'Create',
        color: 'primary'
      },
      {
        key: 'cancel',
        index: 2,
        title: 'Cancel',
        color: 'primary',
        kind: 'simple',
        secondary: true
      }
    ]

    const webhookForm = (
      <>
        {this.state.openDialog && (
          <DefaultDialog
            title="New Webhook"
            color="default"
            size="medium"
            showCloseButton
            onClose={() => this.toggleDialog(false)}
            onAction={this.handleAction}
            actions={
              this.state.pendingWebhookTitle && this.state.pendingWebhookURL
                ? actions
                : [actions[1]]
            }
          >
            <DialogContent size="auto" padding="large">
              <form>
                <div className={styles.fieldWrapper}>
                  <DefaultTextField
                    label="Title"
                    onChange={event =>
                      this.setFormValue(
                        'pendingWebhookTitle',
                        event.target.value
                      )
                    }
                    value={this.state.pendingWebhookTitle}
                  />
                  <DefaultTextField
                    label="URL"
                    type="url"
                    onChange={event =>
                      this.setFormValue('pendingWebhookURL', event.target.value)
                    }
                    value={this.state.pendingWebhookURL}
                  />
                  <DefaultTextField
                    label="Vercel Project Name"
                    onChange={event =>
                      this.setFormValue(
                        'pendingVercelProject',
                        event.target.value
                      )
                    }
                    value={this.state.pendingVercelProject}
                  />
                  <DefaultTextField
                    label="Vercel Token"
                    onChange={event =>
                      this.setFormValue(
                        'pendingVercelToken',
                        event.target.value
                      )
                    }
                    value={this.state.pendingVercelToken}
                  />
                </div>
              </form>
            </DialogContent>
          </DefaultDialog>
        )}
      </>
    )

    const emptyState = !this.state.webhooks.length && (
      <p className={styles.emptyList}>No webhooks created yet.</p>
    )

    return (
      <div className={styles.appContainer}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>Webhooks</h2>
          </div>
          <div className={styles.list}>
            {webhookList}
            {emptyState}
          </div>
          <div className={styles.footer}>
            <AnchorButton
              onClick={() => this.toggleDialog(true)}
              bleed
              color="primary"
              kind="simple"
            >
              Create Webhook
            </AnchorButton>
          </div>
        </div>
        {webhookForm}

        {this.state.snackbar.active && (
          <Snackbar
            kind={this.state.snackbar.kind}
            isPersisted={false}
            isCloseable
            timeout={4000}
            title={this.state.snackbar.title}
            allowDuplicateSnackbarType
            onClose={this.resetSnackbar}
          >
            {this.state.snackbar.message}
          </Snackbar>
        )}
      </div>
    )
  }
}
