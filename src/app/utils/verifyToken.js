import { BASE_URL } from "../../contants";
async function checkUserVerified(token) {
  try {
    const response = await fetch(`${BASE_URL}/api/verify-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify({ token }) // Send in body if needed
    })

    console.log(response)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }


    const data = await response.json()
    return data ? true : false
  } catch (error) {
    console.error('Error verifying user:', error.message)
    return false
  }
}

export default checkUserVerified;