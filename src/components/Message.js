import React, { useState } from 'react'
import classNames from 'classnames'
import moment from 'moment'
import { Button, OverlayTrigger, Popover, Tooltip } from 'react-bootstrap'

import { useAuthStateContext } from '../context/auth'
import { gql, useMutation } from '@apollo/client'

const reactions = ['❤️', '😆', '😯', '😢', '😡', '👍', '👎']

const REACT_TO_MESSAGE = gql`
  mutation sendReaction($messageId:ID!, $content: String!) {
    sendReaction(messageId: $messageId, content: $content) {
      id
    }
  }
`

export default function Message({ message }) {
  const { user } = useAuthStateContext()
  const sent = message.from === user.id
  const received = !sent
  const [showPopover, setShowPopover] = useState(false)
  const reactionIcons = [...new Set(message.reactions.map((r) => r.content))]

  const [reactToMessage] = useMutation(REACT_TO_MESSAGE, {
    onError: (err) => console.log(err),
    onCompleted: (data) => setShowPopover(false),
  })

  const react = (reaction) => {
    reactToMessage({ variables: { messageId: message.id, content: reaction } })
  }

  const reactButton = (
    <OverlayTrigger
      trigger="click"
      placement="top"
      show={showPopover}
      onToggle={setShowPopover}
      transition={false}
      rootClose
      overlay={
        <Popover className="rounded-pill">
          <Popover.Content className="px-0 py-1 d-flex align-items-center">
            {reactions.map((reaction) => (
              <Button
                variant="link"
                className="emoji"
                key={reaction}
                onClick={() => react(reaction)}
              >
                {reaction}
              </Button>
            ))}
          </Popover.Content>
        </Popover>
      }
    >
      <Button variant="link" className="px-2">
        <i className="far fa-smile react__button"></i>
      </Button>
    </OverlayTrigger>
  )

  return (
    <div
      className={classNames('d-flex my-3', {
        'ml-auto': sent,
        'mr-auto': received,
      })}
    >
      {sent && reactButton}
      <OverlayTrigger
        placement={sent ? 'left' : 'right'}
        overlay={
          <Tooltip>
            {moment(message.createdAt).format('MMM DD, YYYY @ h:mm a')}
          </Tooltip>
        }
        transition={false}
      >
        <div
          className={classNames('py-2 px-3 rounded-pill position-relative', {
            'bg-primary': sent,
            'bg-secondary': received,
          })}
        >
          {message.reactions.length > 0 && (
            <div className={classNames("reactions__box bg-secondary p-1 rounded-pill",{'ours':sent},{'recivers':received})}>
              {reactionIcons.map(r => (
                <p>
                  {r}
                </p>
              ))}
              
              <p>
                {message.reactions.length}
              </p>
            </div>
          )}
          <p className={classNames({ 'text-white': sent })} key={message.id}>
            {message.content}
          </p>
        </div>
      </OverlayTrigger>
      {received && reactButton}
    </div>
  )
}
