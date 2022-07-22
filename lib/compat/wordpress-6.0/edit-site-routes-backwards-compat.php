<?php

/**
 * Site editor's Menu.
 *
 * Adds a new wp-admin menu item for the Site editor.
 *
 * @since 9.4.0
 */
function gutenberg_site_editor_menu() {
	if ( wp_is_block_theme() ) {
		add_theme_page(
			__( 'Editor (beta)', 'gutenberg' ),
			sprintf(
			/* translators: %s: "beta" label. */
				__( 'Editor %s', 'gutenberg' ),
				'<span class="awaiting-mod">' . __( 'beta', 'gutenberg' ) . '</span>'
			),
			'edit_theme_options',
			'gutenberg-edit-site',
			'gutenberg_edit_site_page'
		);
	}
}
add_action( 'admin_menu', 'gutenberg_site_editor_menu', 9 );

function gutenberg_redirect_deprecated_to_new_site_editor_page() {
		wp_safe_redirect( 'site-editor.php' );
}

add_action( 'load-appearance_page_gutenberg-edit-site', 'gutenberg_redirect_deprecated_to_new_site_editor_page' );
