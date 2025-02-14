/**
 * External dependencies
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import BoxControl from '../';

jest.useFakeTimers();

const Example = ( extraProps ) => {
	const [ state, setState ] = useState();

	return (
		<BoxControl
			values={ state }
			onChange={ ( next ) => setState( next ) }
			{ ...extraProps }
		/>
	);
};

describe( 'BoxControl', () => {
	describe( 'Basic rendering', () => {
		it( 'should render a box control input', () => {
			render( <BoxControl /> );

			expect(
				screen.getByRole( 'textbox', { name: 'Box Control' } )
			).toBeVisible();
		} );

		it( 'should update values when interacting with input', async () => {
			const user = userEvent.setup( {
				advanceTimers: jest.advanceTimersByTime,
			} );

			render( <BoxControl /> );

			const input = screen.getByRole( 'textbox', {
				name: 'Box Control',
			} );

			await user.type( input, '100%' );
			await user.keyboard( '{Enter}' );

			expect( input ).toHaveValue( '100' );
			expect(
				screen.getByRole( 'combobox', {
					name: 'Select unit',
				} )
			).toHaveValue( '%' );
		} );
	} );

	describe( 'Reset', () => {
		it( 'should reset values when clicking Reset', async () => {
			const user = userEvent.setup( {
				advanceTimers: jest.advanceTimersByTime,
			} );

			render( <BoxControl /> );

			const input = screen.getByRole( 'textbox', {
				name: 'Box Control',
			} );
			const select = screen.getByRole( 'combobox', {
				name: 'Select unit',
			} );

			await user.type( input, '100px' );
			await user.keyboard( '{Enter}' );

			expect( input ).toHaveValue( '100' );
			expect( select ).toHaveValue( 'px' );

			await user.click( screen.getByRole( 'button', { name: 'Reset' } ) );

			expect( input ).toHaveValue( '' );
			expect( select ).toHaveValue( 'px' );
		} );

		it( 'should reset values when clicking Reset, if controlled', async () => {
			const user = userEvent.setup( {
				advanceTimers: jest.advanceTimersByTime,
			} );

			render( <Example /> );

			const input = screen.getByRole( 'textbox', {
				name: 'Box Control',
			} );
			const select = screen.getByRole( 'combobox', {
				name: 'Select unit',
			} );

			await user.type( input, '100px' );
			await user.keyboard( '{Enter}' );

			expect( input ).toHaveValue( '100' );
			expect( select ).toHaveValue( 'px' );

			await user.click( screen.getByRole( 'button', { name: 'Reset' } ) );

			expect( input ).toHaveValue( '' );
			expect( select ).toHaveValue( 'px' );
		} );

		it( 'should reset values when clicking Reset, if controlled <-> uncontrolled state changes', async () => {
			const user = userEvent.setup( {
				advanceTimers: jest.advanceTimersByTime,
			} );

			render( <Example /> );

			const input = screen.getByRole( 'textbox', {
				name: 'Box Control',
			} );
			const select = screen.getByRole( 'combobox', {
				name: 'Select unit',
			} );

			await user.type( input, '100px' );
			await user.keyboard( '{Enter}' );

			expect( input ).toHaveValue( '100' );
			expect( select ).toHaveValue( 'px' );

			await user.click( screen.getByRole( 'button', { name: 'Reset' } ) );

			expect( input ).toHaveValue( '' );
			expect( select ).toHaveValue( 'px' );
		} );

		it( 'should persist cleared value when focus changes', async () => {
			const user = userEvent.setup( {
				advanceTimers: jest.advanceTimersByTime,
			} );
			const spyChange = jest.fn();

			render( <BoxControl onChange={ ( v ) => spyChange( v ) } /> );

			const input = screen.getByRole( 'textbox', {
				name: 'Box Control',
			} );

			await user.type( input, '100%' );
			await user.keyboard( '{Enter}' );

			expect( input ).toHaveValue( '100' );
			expect(
				screen.getByRole( 'combobox', {
					name: 'Select unit',
				} )
			).toHaveValue( '%' );

			await user.clear( input );
			expect( input ).toHaveValue( '' );
			// Clicking document.body to trigger a blur event on the input.
			await user.click( document.body );

			expect( input ).toHaveValue( '' );
			expect( spyChange ).toHaveBeenLastCalledWith( {
				top: undefined,
				right: undefined,
				bottom: undefined,
				left: undefined,
			} );
		} );
	} );

	describe( 'Unlinked sides', () => {
		it( 'should update a single side value when unlinked', async () => {
			const user = userEvent.setup( {
				advanceTimers: jest.advanceTimersByTime,
			} );

			render( <Example /> );

			await user.click(
				screen.getByRole( 'button', { name: 'Unlink sides' } )
			);

			await user.type(
				screen.getByRole( 'textbox', { name: 'Top' } ),
				'100px'
			);
			await user.keyboard( '{Enter}' );

			expect(
				screen.getByRole( 'textbox', { name: 'Top' } )
			).toHaveValue( '100' );
			expect(
				screen.getByRole( 'textbox', { name: 'Right' } )
			).not.toHaveValue();
			expect(
				screen.getByRole( 'textbox', { name: 'Bottom' } )
			).not.toHaveValue();
			expect(
				screen.getByRole( 'textbox', { name: 'Left' } )
			).not.toHaveValue();

			screen
				.getAllByRole( 'combobox', { name: 'Select unit' } )
				.forEach( ( combobox ) => {
					expect( combobox ).toHaveValue( 'px' );
				} );
		} );

		it( 'should update a whole axis when value is changed when unlinked', async () => {
			const user = userEvent.setup( {
				advanceTimers: jest.advanceTimersByTime,
			} );

			render( <Example splitOnAxis /> );

			await user.click(
				screen.getByRole( 'button', { name: 'Unlink sides' } )
			);

			await user.type(
				screen.getByRole( 'textbox', {
					name: 'Vertical',
				} ),
				'100px'
			);
			await user.keyboard( '{Enter}' );

			expect(
				screen.getByRole( 'textbox', { name: 'Vertical' } )
			).toHaveValue( '100' );
			expect(
				screen.getByRole( 'textbox', { name: 'Horizontal' } )
			).not.toHaveValue();

			screen
				.getAllByRole( 'combobox', { name: 'Select unit' } )
				.forEach( ( combobox ) => {
					expect( combobox ).toHaveValue( 'px' );
				} );
		} );
	} );

	describe( 'Unit selections', () => {
		it( 'should update unlinked controls unit selection based on all input control', async () => {
			const user = userEvent.setup( {
				advanceTimers: jest.advanceTimersByTime,
			} );

			// Render control.
			render( <BoxControl /> );

			// Make unit selection on all input control.
			await user.selectOptions(
				screen.getByRole( 'combobox', {
					name: 'Select unit',
				} ),
				[ 'em' ]
			);

			// Unlink the controls.
			await user.click(
				screen.getByRole( 'button', { name: 'Unlink sides' } )
			);

			const controls = screen.getAllByRole( 'combobox', {
				name: 'Select unit',
			} );

			// Confirm we have exactly 4 controls.
			expect( controls ).toHaveLength( 4 );

			// Confirm that each individual control has the selected unit
			controls.forEach( ( control ) => {
				expect( control ).toHaveValue( 'em' );
			} );
		} );

		it( 'should use individual side attribute unit when available', async () => {
			const user = userEvent.setup( {
				advanceTimers: jest.advanceTimersByTime,
			} );

			// Render control.
			const { rerender } = render( <BoxControl /> );

			// Make unit selection on all input control.
			await user.selectOptions(
				screen.getByRole( 'combobox', {
					name: 'Select unit',
				} ),
				[ 'vw' ]
			);

			// Unlink the controls.
			await user.click(
				screen.getByRole( 'button', { name: 'Unlink sides' } )
			);

			const controls = screen.getAllByRole( 'combobox', {
				name: 'Select unit',
			} );

			// Confirm we have exactly 4 controls.
			expect( controls ).toHaveLength( 4 );

			// Confirm that each individual control has the selected unit
			controls.forEach( ( control ) => {
				expect( control ).toHaveValue( 'vw' );
			} );

			// Rerender with individual side value & confirm unit is selected.
			rerender( <BoxControl values={ { top: '2.5em' } } /> );

			const rerenderedControls = screen.getAllByRole( 'combobox', {
				name: 'Select unit',
			} );

			// Confirm we have exactly 4 controls.
			expect( rerenderedControls ).toHaveLength( 4 );

			// Confirm that each individual control has the right selected unit
			rerenderedControls.forEach( ( control, index ) => {
				const expected = index === 0 ? 'em' : 'vw';
				expect( control ).toHaveValue( expected );
			} );
		} );
	} );

	describe( 'onChange updates', () => {
		it( 'should call onChange when values contain more than just CSS units', async () => {
			const user = userEvent.setup( {
				advanceTimers: jest.advanceTimersByTime,
			} );
			const setState = jest.fn();

			render( <BoxControl onChange={ setState } /> );

			await user.type(
				screen.getByRole( 'textbox', {
					name: 'Box Control',
				} ),
				'7.5rem'
			);
			await user.keyboard( '{Enter}' );

			expect( setState ).toHaveBeenCalledWith( {
				top: '7.5rem',
				right: '7.5rem',
				bottom: '7.5rem',
				left: '7.5rem',
			} );
		} );

		it( 'should not pass invalid CSS unit only values to onChange', async () => {
			const user = userEvent.setup( {
				advanceTimers: jest.advanceTimersByTime,
			} );
			const setState = jest.fn();

			render( <BoxControl onChange={ setState } /> );

			await user.selectOptions(
				screen.getByRole( 'combobox', {
					name: 'Select unit',
				} ),
				'rem'
			);

			expect( setState ).toHaveBeenCalledWith( {
				top: undefined,
				right: undefined,
				bottom: undefined,
				left: undefined,
			} );
		} );
	} );
} );
