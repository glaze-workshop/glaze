import React from 'react'

const LoginForm = () => {
  return (
    <form style={{ backgroundColor: 'lightgray', borderRadius: 8, padding: 14, height: '100%', overflow: 'hidden' }}>
      <fieldset>
        <legend>Login Form</legend>
        <div>
          <label>
            <span>username: </span>
            <input type="text" />
          </label>
        </div>
        <div>
          <label>
            s<span>password: </span>
            <input type="text" />
          </label>
        </div>
      </fieldset>
    </form>
  )
}

export default LoginForm
