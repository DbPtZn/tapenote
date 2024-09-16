import { ViewComponentProps } from '@textbus/adapter-viewfly';
import { ComponentLoader } from '@textbus/platform-browser';
import './table.component.scss';
import { TableCellConfig, TableComponent } from './table.component';
export declare const TableComponentView: (props: ViewComponentProps<TableComponent>) => () => any;
export declare const tableComponentLoader: ComponentLoader;
export declare function autoComplete(table: TableCellConfig[][]): TableCellConfig[][];
