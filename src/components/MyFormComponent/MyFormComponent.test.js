import {render, fireEvent, waitFor, screen} from '@testing-library/react';
import MyFormComponent from './MyFormComponent';

describe('MyFormComponent', () => {
    // Mock console.log to check if it's called on form submission
    console.log = jest.fn();

    beforeEach(() => {
        render(<MyFormComponent/>);
    });

    describe('Positive Test Cases', () => {
        test('submit the form with all fields filled correctly', async () => {
            fireEvent.change(screen.getByPlaceholderText('Name'), {
                target: {value: 'Test Name'}
            });
            fireEvent.change(screen.getByPlaceholderText('Email'), {
                target: {value: 'test@test.com'}
            });
            fireEvent.click(screen.getByTestId('agreeTerms'));
            fireEvent.click(screen.getByTestId('male'));
            fireEvent.click(screen.getByText(/Submit/i));

            await waitFor(() => expect(screen.queryAllByText(/must be/i)).toHaveLength(0));
            expect(console.log).toHaveBeenCalledWith({
                name: 'Test Name',
                email: 'test@test.com',
                agreeTerms: true,
                gender: 'male',
            });
        });

        test('submit the form with a very long valid name', async () => {
            const longName = 'a'.repeat(300);
            fireEvent.change(screen.getByPlaceholderText('Name'), {
                target: {value: longName}
            });
            fireEvent.change(screen.getByPlaceholderText('Email'), {
                target: {value: 'test@test.com'}
            });
            fireEvent.click(screen.getByTestId('agreeTerms'));
            fireEvent.click(screen.getByTestId('male'));
            fireEvent.click(screen.getByText(/Submit/i));

            await waitFor(() => expect(screen.queryAllByText(/must be/i)).toHaveLength(0));
            expect(console.log).toHaveBeenCalledWith({
                name: longName,
                email: 'test@test.com',
                agreeTerms: true,
                gender: 'male',
            });
        });

        test('submit the form with a complex email address', async () => {
            const complexEmail = 'test.name+alias@example.co.uk';
            fireEvent.change(screen.getByPlaceholderText('Name'), {
                target: {value: 'Test Name'}
            });
            fireEvent.change(screen.getByPlaceholderText('Email'), {
                target: {value: complexEmail}
            });
            fireEvent.click(screen.getByTestId('agreeTerms'));
            fireEvent.click(screen.getByTestId('male'));
            fireEvent.click(screen.getByText(/Submit/i));

            await waitFor(() => expect(screen.queryAllByText(/must be/i)).toHaveLength(0));
            expect(console.log).toHaveBeenCalledWith({
                name: 'Test Name',
                email: complexEmail,
                agreeTerms: true,
                gender: 'male',
            });
        });

        test('change the gender from male to female', async () => {
            fireEvent.change(screen.getByPlaceholderText('Name'), {
                target: {value: 'Test Name'}
            });
            fireEvent.change(screen.getByPlaceholderText('Email'), {
                target: {value: 'test@test.com'}
            });
            fireEvent.click(screen.getByTestId('agreeTerms'));
            fireEvent.click(screen.getByTestId('female'));
            fireEvent.click(screen.getByText(/Submit/i));

            await waitFor(() => expect(screen.queryAllByText(/must be/i)).toHaveLength(0));
            expect(console.log).toHaveBeenCalledWith({
                name: 'Test Name',
                email: 'test@test.com',
                agreeTerms: true,
                gender: 'female',
            });
        });

        test('re-submit the form after an initial successful submission', async () => {
            fireEvent.change(screen.getByPlaceholderText('Name'), {
                target: {value: 'Test Name'}
            });
            fireEvent.change(screen.getByPlaceholderText('Email'), {
                target: {value: 'test@test.com'}
            });
            fireEvent.click(screen.getByTestId('agreeTerms'));
            fireEvent.click(screen.getByTestId('male'));
            fireEvent.click(screen.getByText(/Submit/i));

            await waitFor(() => expect(screen.queryAllByText(/must be/i)).toHaveLength(0));
            expect(console.log).toHaveBeenCalledWith({
                name: 'Test Name',
                email: 'test@test.com',
                agreeTerms: true,
                gender: 'male',
            });
            console.log.mockClear();

            // Re-submit
            fireEvent.click(screen.getByText(/Submit/i));

            await waitFor(() => expect(screen.queryAllByText(/must be/i)).toHaveLength(0));
            expect(console.log).toHaveBeenCalledWith({
                name: 'Test Name',
                email: 'test@test.com',
                agreeTerms: true,
                gender: 'male',
            });
        });
    });

    describe('Negative Test Cases', () => {
        test('submit the form with the Name field left blank', async () => {
            fireEvent.click(screen.getByText(/Submit/i));

            await waitFor(() => expect(screen.getByText(/Name must be at least 3 characters./i)).toBeInTheDocument());
        });

        test('submit the form with an invalid email address', async () => {
            fireEvent.change(screen.getByPlaceholderText('Email'), {
                target: {value: 'testtest.com'}
            });
            fireEvent.click(screen.getByText(/Submit/i));

            await waitFor(() => expect(screen.getByText(/Email must be valid./i)).toBeInTheDocument());
        });

        test('submit the form without checking the Agree to Terms checkbox', async () => {
            fireEvent.change(screen.getByPlaceholderText('Name'), {
                target: {value: 'Test Name'}
            });
            fireEvent.change(screen.getByPlaceholderText('Email'), {
                target: {value: 'test@test.com'}
            });
            fireEvent.click(screen.getByTestId('male'));
            fireEvent.click(screen.getByText(/Submit/i));

            await waitFor(() => expect(screen.getByText(/You must agree to the terms./i)).toBeInTheDocument());
        });

        test('submit the form without selecting a gender', async () => {
            fireEvent.change(screen.getByPlaceholderText('Name'), {
                target: {value: 'Test Name'}
            });
            fireEvent.change(screen.getByPlaceholderText('Email'), {
                target: {value: 'test@test.com'}
            });
            fireEvent.click(screen.getByTestId('agreeTerms'));
            fireEvent.click(screen.getByText(/Submit/i));

            await waitFor(() => expect(screen.getByText(/You must select a gender./i)).toBeInTheDocument());
        });

        test('submit the form with a name that is less than 3 characters long', async () => {
            fireEvent.change(screen.getByPlaceholderText('Name'), {
                target: {value: 'Te'}
            });
            fireEvent.change(screen.getByPlaceholderText('Email'), {
                target: {value: 'test@test.com'}
            });
            fireEvent.click(screen.getByTestId('agreeTerms'));
            fireEvent.click(screen.getByTestId('male'));
            fireEvent.click(screen.getByText(/Submit/i));

            await waitFor(() => expect(screen.getByText(/Name must be at least 3 characters./i)).toBeInTheDocument());
        });
    });
});