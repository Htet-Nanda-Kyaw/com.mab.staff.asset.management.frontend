import { Component, OnInit } from '@angular/core';
import { AssetService } from '../services/asset/asset.service';
import { environment } from '../environments/environement';
import { GeneralPopupComponent } from '../general-popup/general-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

interface FormData {
  mabAssetId: string;
  assetSerialNo: string;
  wifiAccess: string;
  gpAccess: string;
  selectedAsset?: any;
  assetDetails?: any; // Store selected asset details here
  remarks?: string; // Add remarks field
  categoryId: number | null;  // Allow null for categoryId
  categoryName: string | null;  // Allow null for categoryName
}

@Component({
  selector: 'app-asset-assign',
  templateUrl: './asset-assign.component.html',
  styleUrls: ['./asset-assign.component.scss'],
  standalone: false,
})
export class AssetAssignComponent implements OnInit {
  categories: { categoryId: number; categoryName: string }[] = [];
  assets: any[] = [];
  selectedCategory: string | null = null;
  tempList: FormData[] = [];
  masterDetailKeys: string[] = [];
  pageSize = 5;
  dataSource: FormData[] = [];

  formData: FormData = {
    mabAssetId: '',
    assetSerialNo: '',
    wifiAccess: 'No',
    gpAccess: 'No',
    remarks: '',
    categoryId: null,
    categoryName: null
  };
  constructor(
    private assetService: AssetService,
    private dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchExistingAssets();
  }

  fetchExistingAssets(): void {
    const userId = 2; // Replace with the actual userId (e.g., from a service or token)

    this.assetService.getAssignedAssets().subscribe({
      next: (response) => {
        console.log('Existing assets:', response);

        if (response?.data && Array.isArray(response.data)) {
          this.tempList = response.data.map((item: any) => {
            // Construct assetDetails object dynamically for the UI
            const assetDetails: any = {
              spec1: item.spec1,
              spec2: item.spec2,
              spec3: item.spec3,
              spec4: item.spec4,
              spec5: item.spec5,
              spec6: item.spec6,
              spec7: item.spec7,
              spec8: item.spec8,
              spec9: item.spec9,
              spec10: item.spec10,
            };

            // Return a properly formatted item for tempList
            return {
              mabAssetId: item.mabAssetId || '',
              assetSerialNo: item.assetSerialNo || '',
              wifiAccess: item.wifiAccess ? 'Yes' : 'No',  // Convert to 1 for Yes, 0 for No
            gpAccess: item.gpAccess ? 'Yes' : 'No',      // Convert to 1 for Yes, 0 for No
              categoryId: item.categoryId || null,
              categoryName: item.categoryName || '',
              remarks: item.remarks || '',
              assetDetails: assetDetails,
            };
          });

          // Update master detail keys based on the fetched data
          this.updateMasterDetailKeys();
        } else {
          console.error('Unexpected API response format:', response);
        }
      },
      error: (error) => {
        console.error('Error fetching assigned assets:', error);
      },
    });
  }

  fetchCategories(): void {
    this.assetService.getRefCategories().subscribe({
      next: (response) => {
        console.log(response);
        this.categories = response.data;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      },
    });
  }

  updateForm(categoryName: string): void {
    this.selectedCategory = categoryName;
    this.formData.assetDetails = null;
    this.formData.selectedAsset = '';
    let endpoint = '';
    switch (categoryName.toLowerCase()) {
      case 'laptop':
        endpoint = environment.getAllRefLaptops;
        break;
      case 'hard disk drive external':
        endpoint = environment.getAllRefHDD;
        break;
      case 'monitor':
        endpoint = environment.getAllRefMonitors;
        break;
      case 'printer':
        endpoint = environment.getAllRefPrinters;
        break;
      case 'scanner':
        endpoint = environment.getAllRefScanners;
        break;
      case 'ups':
        endpoint = environment.getAllRefUPS;
        break;
      default:
        console.error('Unknown category selected.');
        return;
    }

    this.assetService.getAssets(endpoint).subscribe({
      next: (response) => {
        if (response?.data && Array.isArray(response.data)) {
          this.assets = response.data.map((item: any) => {
            // Use 'Model' for laptops and create a consistent label for assets
            const label =
              this.selectedCategory?.toLowerCase() === 'laptop'
                ? item['Model']
                : item['Brand Name'];

            return {
              label: label, // Label to display in the dropdown
              value: item.refId, // Unique identifier for the asset
              details: {
                ...item, // Store all asset details here
              },
            };
          });
        } else {
          console.error('Unexpected API response format:', response);
          this.assets = [];
        }
      },
      error: (error) => {
        console.error('Error fetching assets:', error);
        this.assets = [];
      },
    });
  }

  onAssetChange(selectedAssetId: any): void {
    if (!selectedAssetId) {
      this.formData.assetDetails = null; // Clear the details
      return;
    }
    const selectedAsset = this.assets.find(asset => String(asset.value) === String(selectedAssetId));
    console.log('Selected Asset:', selectedAsset);
    if (selectedAsset) {
      this.formData.assetDetails = selectedAsset.details; // Store the selected asset's details
    } else {
      this.formData.assetDetails = null; // Clear the details if no asset is selected
    }
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj).filter(key => key !== 'refId');
  }

  // Add current form data and asset details to the temporary list
  addToList(): void {
    if (this.formData.mabAssetId && this.formData.assetSerialNo) {
      // Add the selected category info to the form data before pushing it to the list
      const categoryInfo = {
        categoryName: this.selectedCategory,
        categoryId: this.categories.find((cat) => cat.categoryName === this.selectedCategory)?.categoryId || null,
      };

      // Create an assetDetails object with keys spec1 to spec10
      const assetDetails: any = {};
      const keys = Object.keys(this.formData.assetDetails || {});
      let specIndex = 1;
      for (let i = 0; i < 10; i++) {
        if (keys[i] && keys[i] !== 'refId') {  // Skip 'refId' field
          assetDetails[`spec${specIndex}`] = this.formData.assetDetails[keys[i]] || null;
          specIndex++; 
        }
      }

      // Push formData along with category information and assetDetails to tempList
      this.tempList.push({
        ...this.formData,
        ...categoryInfo,
        assetDetails: assetDetails, // Include dynamically mapped assetDetails
      });

      // Update master detail keys
      this.updateMasterDetailKeys();
      // Reset the form
      this.resetForm();
    } else {
      alert('Please fill in all required fields.');
    }
  }


  updateMasterDetailKeys(): void {
    const allKeys = this.tempList
      .map((item) => Object.keys(item.assetDetails || {}))
      .flat();
    this.masterDetailKeys = Array.from(new Set(allKeys)).filter((key) => key !== 'refId'); // Exclude refId
  }

  // Remove an item from the temporary list
  removeFromList(index: number): void {
    this.tempList.splice(index, 1);
  }

  // Reset the form fields
  resetForm(): void {
    this.formData = {
      mabAssetId: '',
      assetSerialNo: '',
      wifiAccess: 'No',
      gpAccess: 'No',
      remarks: '',
      categoryId: null,
      categoryName: null
    };
  }

  // Save assets to the server
  saveAssets(): void {
    // Create payload according to the AssetTracker backend entity
    const payload = this.tempList.map((item) => {
      // Flatten assetDetails to spec1 through spec10
      const assetDetails = item.assetDetails || {};
      return {
        userId: null, // Set this dynamically if applicable
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        mabAssetId: item.mabAssetId,
        assetSerialNo: item.assetSerialNo,
        isWifiAccess: item.wifiAccess === 'Yes',
        isGpAccess: item.gpAccess === 'Yes',
        spec1: assetDetails.spec1 || null,
        spec2: assetDetails.spec2 || null,
        spec3: assetDetails.spec3 || null,
        spec4: assetDetails.spec4 || null,
        spec5: assetDetails.spec5 || null,
        spec6: assetDetails.spec6 || null,
        spec7: assetDetails.spec7 || null,
        spec8: assetDetails.spec8 || null,
        spec9: assetDetails.spec9 || null,
        spec10: assetDetails.spec10 || null,
        remarks: item.remarks || '',
      };
    });

    console.log('Payload:', payload);

    // Send payload to the backend
    this.assetService.saveAssignedAssets({ assets: payload }).subscribe({
      next: (response) => {
        console.log(response);
        this.tempList = []; // Clear tempList after saving
        this.fetchExistingAssets();
        const dialogRef = this.dialog.open(GeneralPopupComponent, {
          data: { header: 'Info', message: response.message },
        });
      },
      error: (error) => {
        console.error('Error saving assets:', error);
      },
    });
  }
}
