import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TestModeCheckbox from '../test-mode-checkbox';
import { useTestMode } from 'wcstripe/data';
import { useAccountKeys } from 'wcstripe/data/account-keys/hooks';

jest.mock( 'wcstripe/data', () => ( {
	useTestMode: jest.fn(),
} ) );

jest.mock( 'wcstripe/data/account-keys/hooks', () => ( {
	useAccountKeys: jest.fn(),
} ) );

describe( 'TestModeCheckbox', () => {
	it( 'should enable test mode when the test account keys are present', () => {
		const setTestModeMock = jest.fn();
		useTestMode.mockReturnValue( [ false, setTestModeMock ] );
		useAccountKeys.mockReturnValue( {
			accountKeys: {
				test_publishable_key: 'test_pk',
				test_secret_key: 'test_sk',
				test_webhook_secret: 'test_whs',
			},
		} );

		render( <TestModeCheckbox /> );

		const testModeCheckbox = screen.getByLabelText( 'Enable test mode' );
		expect( testModeCheckbox ).not.toBeChecked();

		userEvent.click( testModeCheckbox );

		expect( setTestModeMock ).toHaveBeenCalledWith( true );
	} );

	it( 'should enable live mode when the account keys are present', () => {
		const setTestModeMock = jest.fn();
		useTestMode.mockReturnValue( [ true, setTestModeMock ] );
		useAccountKeys.mockReturnValue( {
			accountKeys: {
				publishable_key: 'live_pk',
				secret_key: 'live_sk',
				webhook_secret: 'live_whs',
			},
		} );

		render( <TestModeCheckbox /> );

		const testModeCheckbox = screen.getByLabelText( 'Enable test mode' );
		expect( testModeCheckbox ).toBeChecked();

		userEvent.click( testModeCheckbox );

		expect( setTestModeMock ).toHaveBeenCalledWith( false );
	} );

	it( 'should show a modal when the live keys are not present', () => {
		const setTestModeMock = jest.fn();
		useTestMode.mockReturnValue( [ false, setTestModeMock ] );
		useAccountKeys.mockReturnValue( {
			accountKeys: {
				test_publishable_key: '',
				test_secret_key: '',
				test_webhook_secret: '',
			},
		} );

		render( <TestModeCheckbox /> );

		const testModeCheckbox = screen.getByLabelText( 'Enable test mode' );

		userEvent.click( testModeCheckbox );

		expect( setTestModeMock ).not.toHaveBeenCalled();
		expect(
			screen.getByText( 'Edit test account keys & webhooks' )
		).toBeInTheDocument();
	} );

	it( 'should show a modal when the test keys are not present', () => {
		const setTestModeMock = jest.fn();
		useTestMode.mockReturnValue( [ true, setTestModeMock ] );
		useAccountKeys.mockReturnValue( {
			accountKeys: {
				publishable_key: '',
				secret_key: '',
				webhook_secret: '',
			},
		} );

		render( <TestModeCheckbox /> );

		const testModeCheckbox = screen.getByLabelText( 'Enable test mode' );

		userEvent.click( testModeCheckbox );

		expect( setTestModeMock ).not.toHaveBeenCalled();
		expect(
			screen.getByText( 'Edit live account keys & webhooks' )
		).toBeInTheDocument();
	} );
} );
