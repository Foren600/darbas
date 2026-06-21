import react from 'react';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';




export default function SearchBox() {
    const navigate = useNavigate();
    const [query, setQuery] = react.useState('');
    const sumbitHandler = (e) => {
        e.preventDefault();
        navigate(query ? `search/?query=${query}` : 'search');
    }

    return (
        <form className="d-flex me-auto" onSubmit={sumbitHandler}>
            <InputGroup>
                {/* Search box */}
                <Form.Control 
                    type="text" 
                    name="q" 
                    id="q" 
                    onChange={(e) => setQuery(e.target.value)} 
                    placeholder="Search products..." 
                    aria-label="Search products..." 
                    aria-describedby="button-search" 
                />
                <Button className="btn btn-outline-success" type="submit" id="button-search">
                    <i className="fas fa-search"></i>
                </Button>
             </InputGroup>
        </form>
    )
}