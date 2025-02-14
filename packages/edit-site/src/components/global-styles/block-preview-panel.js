/**
 * WordPress dependencies
 */
import { BlockPreview } from '@wordpress/block-editor';
import { getBlockType, getBlockFromExample } from '@wordpress/blocks';
import { useResizeObserver } from '@wordpress/compose';
import { __experimentalSpacer as Spacer } from '@wordpress/components';

const BlockPreviewPanel = ( { name } ) => {
	const [
		containerResizeListener,
		{ width: containerWidth, height: containerHeight },
	] = useResizeObserver();
	const blockExample = getBlockType( name )?.example;
	const blocks = blockExample && getBlockFromExample( name, blockExample );
	const viewportWidth = blockExample?.viewportWidth || containerWidth;
	const minHeight = containerHeight;

	return ! blockExample ? null : (
		<Spacer marginX={ 4 } marginBottom={ 4 }>
			<div className="edit-site-global-styles__block-preview-panel">
				{ containerResizeListener }

				<BlockPreview
					blocks={ blocks }
					viewportWidth={ viewportWidth }
					__experimentalMinHeight={ minHeight }
					__experimentalStyles={ [
						{
							css: `
								body{
									min-height:${ minHeight }px;
									display:flex;align-items:center;justify-content:center;
								}
							`,
						},
					] }
				/>
			</div>
		</Spacer>
	);
};

export default BlockPreviewPanel;
