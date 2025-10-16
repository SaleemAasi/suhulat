'use client';

import { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Paper, Avatar, CircularProgress, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { setCredentials } from "@/store/slices/authSlice";
import { loginUser } from "@/services/authService";

export default function LoginPage() {
    const [email, setEmail] = useState('admin@zphone.com');
    const [password, setPassword] = useState('iMadminF!2');
    const dispatch = useDispatch<AppDispatch>();
    const [error, setError] = useState("");
    const {token, loading } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        
      }, []);

    async function handleLogin() {
        try {
            const data = await loginUser({ email, password });
            dispatch(setCredentials({ user: data.user, token: data.token }));
            localStorage.setItem("token", data.token);
            window.location.href = '/';
        } catch (err: any) {
            setError(err.message);
        }

    }


    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                padding: 2,
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    maxWidth: 400,
                    width: '100%',
                    p: 4,
                    pt: 6,
                    borderRadius: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    position: 'relative',
                    textAlign: 'center',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                }}
            >
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Floating Logo */}
                <Avatar
                    src="/logo.jpg"
                    alt="Z-Phone Logo"
                    sx={{
                        width: 90,
                        height: 90,
                        position: 'absolute',
                        top: '-45px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        border: '3px solid #ffffffff',
                        backgroundColor: '#f4e7e7ff',
                    }}
                />

                <Typography variant="h5" gutterBottom>
                    SUHULAT
                </Typography>

                <TextField
                    label="Email"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                </Button>
            </Paper>
        </Box>
    );
}
