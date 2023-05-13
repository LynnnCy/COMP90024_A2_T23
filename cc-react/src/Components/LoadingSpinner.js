import Spinner from 'react-bootstrap/Spinner';

const LoadingSpinner = () => {
    return (
        <div style={{ 'textAlign': 'center' }}>
            <Spinner  animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    )
}

export default LoadingSpinner;