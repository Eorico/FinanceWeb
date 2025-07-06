import Alert from '@mui/material/Alert';


export default function Invalidation({ children }) {
  return (
    <Alert 
        severity="error"
        sx={{
            backgroundColor: 'transparent',
            color: 'red',
            justifyContent: 'center',
            fontWeight: 'bold',
        }}
    >
        {children}
    </Alert>
  );
}