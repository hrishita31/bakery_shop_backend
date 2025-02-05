const forgotPasswordResponse = (res, newPassword, confirmPassword, token) => {
    return res.send({
        newPassword : newPassword,
        confirmNewPassword: confirmPassword,
        token: token,
    })
}

export {forgotPasswordResponse};