import { Proposed, TypeHierarchyItem } from 'vscode-languageserver-protocol';
import type { Feature, _Languages, ServerRequestHandler } from './server';
/**
 * Shape of the type hierarchy feature
 *
 * @since 3.17.0 - proposed state
 */
export interface TypeHierarchyFeatureShape {
    typeHierarchy: {
        onPrepare(handler: ServerRequestHandler<Proposed.TypeHierarchyPrepareParams, TypeHierarchyItem[] | null, never, void>): void;
        onSupertypes(handler: ServerRequestHandler<Proposed.TypeHierarchySupertypesParams, TypeHierarchyItem[] | null, TypeHierarchyItem[], void>): void;
        onSubtypes(handler: ServerRequestHandler<Proposed.TypeHierarchySubtypesParams, TypeHierarchyItem[] | null, TypeHierarchyItem[], void>): void;
    };
}
export declare const TypeHierarchyFeature: Feature<_Languages, TypeHierarchyFeatureShape>;
