import React, { useState } from 'react'

import { TextInputWithButton } from 'components/common'

const TelegramValidationInput = ({
  onClick,
  buttonDisabled,
}: {
  onClick: (recipient: string) => any
  buttonDisabled?: boolean
}) => {
  const [recipient, setRecipient] = useState('')
  const [isValidating, setIsValidating] = useState(false)

  function isInvalidRecipient() {
    return !/^\+?\d+$/g.test(recipient)
  }

  async function onClickHandler() {
    setIsValidating(true)
    await onClick(recipient)
    setIsValidating(false)
    setRecipient('')
  }

  return (
    <TextInputWithButton
      type="tel"
      value={recipient}
      onChange={setRecipient}
      onClick={onClickHandler}
      inputDisabled={isValidating}
      buttonDisabled={isInvalidRecipient() || isValidating || buttonDisabled}
      placeholder="Enter test mobile number"
    >
      {isValidating ? (
        'Sending...'
      ) : (
        <>
          Send test message
          <i className="bx bxl-telegram"></i>
        </>
      )}
    </TextInputWithButton>
  )
}

export default TelegramValidationInput
