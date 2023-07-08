# MyFormComponent Testing

This React application contains a single form, `MyFormComponent`, which is designed to take user input for fields like name, email, gender, and agreement to terms. The component also has form validation logic that checks the inputted values for specific conditions, such as a name having at least 3 characters, a valid email address, agreement to terms, and gender selection. When the form is submitted, it logs the form data to the console. We have created a suite of unit tests using Jest and React Testing Library to ensure that `MyFormComponent` is functioning as expected.

The testing suite consists of two groups of tests: Positive Test Cases and Negative Test Cases. The Positive Test Cases check that the form behaves as expected when it is filled out correctly. This includes scenarios such as submitting the form with all fields filled in correctly, a long valid name, a complex valid email address, a change in gender selection, and multiple submissions of the form. The Negative Test Cases, on the other hand, are designed to trigger the form validation errors, testing the robustness of the form validation logic. The tests check scenarios such as submitting the form with a blank name, an invalid email address, without agreeing to the terms, without selecting a gender, and with a name less than 3 characters long.

## Running Tests Locally

Follow the steps below to run the tests locally:

1. Clone the repository to your local machine. You can do this by running `git clone https://github.com/AndriiKachkarov/my-app.git` in your terminal.
2. Navigate into the project directory by running `cd my-app`.
3. Install the project dependencies by running `npm install`.
4. Once the installation is complete, you can run the tests by typing `npm test` in the terminal.

If the tests are set up correctly and all the dependencies are installed, you should see the results of the tests printed in your terminal.