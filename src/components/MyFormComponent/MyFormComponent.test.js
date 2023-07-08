import {render, fireEvent, waitFor, screen} from '@testing-library/react';
import MyFormComponent from './MyFormComponent';

describe('MyFormComponent', () => {
    // Mock console.log to check if it's called on form submission
    console.log = jest.fn();

    const setup = () => {
        render(<MyFormComponent/>);
        const submitButton = screen.getByText(/Submit/i);

        const fillForm = (name, email, agreeTerms, gender) => {
            fireEvent.change(screen.getByPlaceholderText(/Name/i), { target: { value: name } });
            fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: email } });
            if (agreeTerms) {
                fireEvent.click(screen.getByTestId('agreeTerms'));
            }
            if(gender) {
                fireEvent.click(screen.getByTestId(gender));
            }
        };

        return { submitButton, fillForm };
    };

    describe('Positive Test Cases', () => {
        test('submit the form with all fields filled in correctly', async () => {
            const {fillForm, submitButton} = setup();
            fillForm('Test Name', 'test@example.com', true, 'male');
            fireEvent.click(submitButton);
            await waitFor(() => expect(console.log).toHaveBeenCalledWith({
                name: 'Test Name',
                email: 'test@example.com',
                agreeTerms: true,
                gender: 'male',
            }));
        });

        test('submit the form with a very long valid name', async () => {
            const {fillForm, submitButton} = setup();
            fillForm('Test Name'.repeat(50), 'test@example.com', true, 'male');
            fireEvent.click(submitButton);
            await waitFor(() => expect(console.log).toHaveBeenCalledWith({
                name: 'Test Name'.repeat(50),
                email: 'test@example.com',
                agreeTerms: true,
                gender: 'male',
            }));
        });

        test('submit the form with a complex valid email address', async () => {
            const {fillForm, submitButton} = setup();
            fillForm('Test Name', 'test.name+alias@example.co.uk', true, 'male');
            fireEvent.click(submitButton);
            await waitFor(() => expect(console.log).toHaveBeenCalledWith({
                name: 'Test Name',
                email: 'test.name+alias@example.co.uk',
                agreeTerms: true,
                gender: 'male',
            }));
        });

        test('change gender and submit the form', async () => {
            const {fillForm, submitButton} = setup();
            fillForm('Test Name', 'test@example.com', true, 'female');
            fireEvent.click(submitButton);
            await waitFor(() => expect(console.log).toHaveBeenCalledWith({
                name: 'Test Name',
                email: 'test@example.com',
                agreeTerms: true,
                gender: 'female',
            }));
        });

        test('resubmit the form after initial successful submission', async () => {
            const { fillForm, submitButton } = setup();

            fillForm('Test Name', 'test@example.com', true, 'male');
            fireEvent.click(submitButton);

            await waitFor(() => expect(console.log).toHaveBeenCalledWith({
                name: 'Test Name',
                email: 'test@example.com',
                agreeTerms: true,
                gender: 'male',
            }));

            // Clear console.log mock for resubmission
            console.log.mockClear();

            // Uncheck the 'agreeTerms' checkbox
            fireEvent.click(screen.getByTestId('agreeTerms'));

            fillForm('Another Name', 'another@example.com', true, 'female');
            fireEvent.click(submitButton);

            await waitFor(() => expect(console.log).toHaveBeenCalledWith({
                name: 'Another Name',
                email: 'another@example.com',
                agreeTerms: true,
                gender: 'female',
            }));
        });
    });

    describe('Negative Test Cases', () => {
        test('submit the form with the Name field left blank', async () => {
            const {fillForm, submitButton} = setup();
            fillForm('', 'test@example.com', true, 'male');
            fireEvent.click(submitButton);
            await waitFor(() => expect(screen.getByText(/Name must be at least 3 characters./i)).toBeInTheDocument());
        });

        test('submit the form with an invalid email address', async () => {
            const {fillForm, submitButton} = setup();
            fillForm('Test Name', 'testexample.com', true, 'male');
            fireEvent.click(submitButton);
            await waitFor(() => expect(screen.getByText(/Email must be valid./i)).toBeInTheDocument());
        });

        test('submit the form without checking the Agree to Terms checkbox', async () => {
            const {fillForm, submitButton} = setup();
            fillForm('Test Name', 'test@example.com', false, 'male');
            fireEvent.click(submitButton);
            await waitFor(() => expect(screen.getByText(/You must agree to the terms./i)).toBeInTheDocument());
        });

        test('submit the form without selecting a gender', async () => {
            const {fillForm, submitButton} = setup();
            fillForm('Test Name', 'test@example.com', true, '');
            fireEvent.click(submitButton);
            await waitFor(() => expect(screen.getByText(/You must select a gender./i)).toBeInTheDocument());
        });

        test('submit the form with a name that is less than 3 characters long', async () => {
            const {fillForm, submitButton} = setup();
            fillForm('Te', 'test@example.com', true, 'male');
            fireEvent.click(submitButton);
            await waitFor(() => expect(screen.getByText(/Name must be at least 3 characters./i)).toBeInTheDocument());
        });
    });
});