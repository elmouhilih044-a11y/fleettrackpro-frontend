import { useEffect, useState } from "react"
import { request } from "./api"

export function useApiGet(path, token) {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState("loading")
  const [error, setError] = useState(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    /* eslint-disable react-hooks/set-state-in-effect -- schéma de lecture imposé par le brief */
    setStatus("loading")
    setError(null)
    /* eslint-enable react-hooks/set-state-in-effect */

    request(path, { token, signal: controller.signal })
      .then((result) => {
        setData(result)
        setStatus("ready")
      })
      .catch((caught) => {
        if (caught.name === "AbortError") return
        setError(caught)
        setStatus("error")
      })

    return () => controller.abort()
  }, [path, token, version])

  function reload() {
    setVersion((current) => current + 1)
  }

  return { data, status, error, reload }
}