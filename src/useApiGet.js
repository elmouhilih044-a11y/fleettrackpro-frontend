import { useEffect, useState } from "react"
import { request } from "./api"

export function useApiGet(path, token) {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState("loading")
  const [error, setError] = useState(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setStatus("loading")
    setError(null)

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