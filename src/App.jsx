import { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode' 
import axios from 'axios'
import styled from 'styled-components'

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Arial', sans-serif;
  padding: 1rem;
`

const LoginContainer = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: clamp(1.5rem, 5vw, 2.5rem);
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 90%;
  max-width: 500px;
  min-width: 280px;
  transition: transform 0.3s ease;

  @media (min-width: 768px) {
    padding: 2.5rem;
  }

  @media (min-width: 1024px) {
    max-width: 600px;
  }

  &:hover {
    transform: translateY(-5px);
  }
`

const Title = styled.h2`
  color: #333;
  margin-bottom: clamp(1rem, 4vw, 1.5rem);
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 600;
`

const GoogleButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  width: 100%;

  @media (min-width: 768px) {
    margin-top: 1.5rem;
  }
`

function App() {
  useEffect(() => {
    // Log environment variables when component mounts
    console.log('API Endpoint:', import.meta.env.VITE_API_ENDPOINT)

    // Since we are using google script in index.html and it is loading asynchrio we do not know when it will be loaded---> so we use setInterval at every 300ms.
    const interval = setInterval(() => {
      // This if(window.google checks if the script in index is injected or not)
      if (window.google) {
        google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          // the callback is the function that gets executed once the user is verified 
          callback: handleCallbackResponse,
        })

        google.accounts.id.renderButton(
          document.getElementById('googleSignIn'),
          {
            theme: 'outline',
            size: 'large',
          }
        )

        clearInterval(interval)
      }
    }, 300)

    return () => clearInterval(interval)
  }, [])

  const handleCallbackResponse = async (response) => {
    const userObject = jwtDecode(response.credential)
    console.log('User:', userObject)

    try {
      await axios.post(`${import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3000'}/api/save-user`, {
        email: userObject.email,
        name: userObject.given_name
      })
      alert('Email sent to backend!')
    } catch (err) {
      console.error('Error saving email:', err)
    }
  }

  return (
    <AppContainer>
      <LoginContainer>
        <Title>Continue with Google</Title>
        <GoogleButtonContainer id="googleSignIn"></GoogleButtonContainer>
      </LoginContainer>
    </AppContainer>
  )
}

export default App
