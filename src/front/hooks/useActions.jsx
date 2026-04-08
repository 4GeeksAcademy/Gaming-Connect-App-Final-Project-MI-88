const useActions = () => {
    const postToIGDB = async (endpoint, bodyQuery) => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL

            if (!backendUrl) {
                throw new Error("VITE_BACKEND_URL is not defined")
            }

            // Send request to backend proxy
            const response = await fetch(`${backendUrl}/api/games`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    endpoint: endpoint,
                    query: bodyQuery
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "IGDB request failed")
            }

            return data
        } catch (err) {
            console.error("IGDB fetch error:", err)
            return { error: err.message || "IGDB fetch failed" }
        }
    }

    return { postToIGDB }
}

export default useActions






