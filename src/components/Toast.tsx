import { useEffect, useState } from 'react'

let setToastImpl: ((msg: string) => void) | null = null

export function toast(msg: string) {
  if (setToastImpl) setToastImpl(msg)
}

export function Toast() {
  const [msg, setMsg] = useState('')
  const [show, setShow] = useState(false)

  useEffect(() => {
    setToastImpl = (m: string) => {
      setMsg(m)
      setShow(true)
      window.setTimeout(() => setShow(false), 3600)
    }
    return () => { setToastImpl = null }
  }, [])

  return (
    <div id="toast" className={show ? 'show' : ''}>
      {msg}
    </div>
  )
}
