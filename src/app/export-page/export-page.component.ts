import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { ExportService } from '../services/export/export.service';

@Component({
    selector: 'app-export-page',
    templateUrl: './export-page.component.html',
    styleUrls: ['./export-page.component.scss'],
    standalone: false,
})
export class ExportPageComponent {
    constructor(private exportService: ExportService) {}

    exportAssets() {

        this.exportService.getAllAssets().subscribe({
            next:(response) => {
                if (response && Array.isArray(response.data)) {
                    this.generateExcel(response.data);
                } else {
                    console.error('Invalid response from API');
                }
            },
            error:(error) => {
                console.error('Error fetching asset data:', error);
            }
    });
    }

    private generateExcel(data: any[]) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Assets');

        // Define headers based on object keys
        const headers = Object.keys(data[0] || {});
        worksheet.addRow(headers);

        // Add data rows
        data.forEach((row) => {
            worksheet.addRow(Object.values(row));
        });

        // Save the workbook
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, `AssetData_${new Date().toISOString()}.xlsx`);
        });
    }
}
