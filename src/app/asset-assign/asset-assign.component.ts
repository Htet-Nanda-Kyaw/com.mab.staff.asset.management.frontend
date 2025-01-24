import { Component, OnInit } from '@angular/core';
import { AssetService } from '../services/asset/asset.service';
import { environment } from '../environments/environement';
import { GeneralPopupComponent } from '../general-popup/general-popup.component';
import { MatDialog } from '@angular/material/dialog';

// Interface defining the structure of the form data.
interface FormData {
  mabAssetId: string;
  assetSerialNo: string;
  wifiAccess: string;
  gpAccess: string;
  selectedAsset?: any;
  assetDetails?: any;
  remarks?: string;
  categoryId: number | null;
  categoryName: string | null;
}

@Component({
  selector: 'app-asset-assign',
  templateUrl: './asset-assign.component.html',
  styleUrls: ['./asset-assign.component.scss'],
  standalone: false,
})
export class AssetAssignComponent implements OnInit {
  // Arrays to store asset categories, assets, and temporary asset list.
  categories: { categoryId: number; categoryName: string }[] = [];
  assets: any[] = [];
  selectedCategory: string | null = null;
  tempList: FormData[] = [];
  masterDetailKeys: string[] = [];
  pageSize = 5; // Defines the page size for assets
  dataSource: FormData[] = []; // Data source for the table
  isExistingAsset: boolean = true;

  // Default form data initialization
  formData: FormData = {
    mabAssetId: '',
    assetSerialNo: '',
    wifiAccess: 'No',
    gpAccess: 'No',
    remarks: '',
    categoryId: null,
    categoryName: null,
  };

  constructor(
    private assetService: AssetService, // Inject asset service for API calls
    private dialog: MatDialog // Inject MatDialog for popups
  ) { }

  ngOnInit(): void {
    this.fetchCategories(); // Fetch asset categories when the component is initialized
    this.fetchExistingAssets(); // Fetch already assigned assets on init
  }

  // Fetch existing assets that are already assigned
  fetchExistingAssets(): void {
    this.isExistingAsset = true;
    this.assetService.getAssignedAssets().subscribe({
      next: (response) => {
        if (response?.data && Array.isArray(response.data)) {
          if (response.data.length === 0) {
            this.isExistingAsset = false;
          }
          this.tempList = response.data.map((item: any) => {
            // Map asset details from response to required format
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
            return {
              mabAssetId: item.mabAssetId || '',
              assetSerialNo: item.assetSerialNo || '',
              wifiAccess: item.wifiAccess ? 'Yes' : 'No',
              gpAccess: item.gpAccess ? 'Yes' : 'No',
              categoryId: item.categoryId || null,
              categoryName: item.categoryName || '',
              remarks: item.remarks || '',
              assetDetails: assetDetails,
            };
          });
          this.updateMasterDetailKeys(); // Update master-detail keys
        } else {
          console.error('Unexpected API response format:', response);
        }
      },
      error: (error) => {
        console.error('Error fetching assigned assets:', error);
      },
    });
  }

  // Fetch categories of assets from the API
  fetchCategories(): void {
    this.assetService.getRefCategories().subscribe({
      next: (response) => {
        this.categories = response.data; // Store the categories in the component
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      },
    });
  }

  // Update the form based on the selected asset category
  updateForm(categoryName: string): void {
    this.selectedCategory = categoryName; // Store selected category name
    this.formData.assetDetails = null; // Reset asset details
    this.formData.selectedAsset = ''; // Reset selected asset
    let endpoint = ''; // Initialize the endpoint for fetching assets

    // Determine the API endpoint based on selected category
    switch (categoryName.toLowerCase()) {
      case 'laptop/desktop':
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

    // Fetch assets based on the selected category
    this.assetService.getAssets(endpoint).subscribe({
      next: (response) => {
        if (response?.data && Array.isArray(response.data)) {
          this.assets = response.data.map((item: any) => {
            // Map asset details to display format
            const detailsToDisplay = Object.entries(item)
              .filter(([key, value]) => key !== 'refId' && value)
              .map(([key, value]) => `${value}`)
              .join(' - ');

            return {
              label: detailsToDisplay,
              value: item.refId,
              details: { ...item },
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

  // Handle the change in selected asset
  onAssetChange(selectedAssetId: any): void {
    if (!selectedAssetId) {
      this.formData.assetDetails = null; // Clear asset details if no asset is selected
      return;
    }
    const selectedAsset = this.assets.find(
      (asset) => String(asset.value) === String(selectedAssetId)
    );
    if (selectedAsset) {
      this.formData.assetDetails = selectedAsset.details; // Set the asset details
    } else {
      this.formData.assetDetails = null; // Reset asset details if asset not found
    }
  }

  // Extracts object keys for the provided object
  objectKeys(obj: any): string[] {
    return Object.keys(obj).filter((key) => key !== 'refId');
  }

  // Add form data to the temporary list of assets
  addToList(): void {
    if (this.formData.mabAssetId && this.formData.assetSerialNo && this.formData.selectedAsset) {
      const categoryInfo = {
        categoryName: this.selectedCategory,
        categoryId:
          this.categories.find((cat) => cat.categoryName === this.selectedCategory)?.categoryId || null,
      };

      // Map asset details to the required structure
      const assetDetails: any = {};
      const keys = Object.keys(this.formData.assetDetails || {});
      let specIndex = 1;
      for (let i = 0; i < 10; i++) {
        if (keys[i] && keys[i] !== 'refId') {
          assetDetails[`spec${specIndex}`] = this.formData.assetDetails[keys[i]] || null;
          specIndex++;
        }
      }

      // Push the form data to the temporary list
      this.tempList.push({
        ...this.formData,
        ...categoryInfo,
        assetDetails: assetDetails,
      });

      this.updateMasterDetailKeys(); // Update master-detail keys
      this.resetForm(); // Reset the form after adding
    } else {
      // Show validation popup if required fields are missing
      this.dialog.open(GeneralPopupComponent, {
        data: { header: 'Validation', message: 'Please fill in all required fields.' },
      });
    }
  }

  // Update master-detail keys based on the temporary list of assets
  updateMasterDetailKeys(): void {
    const allKeys = this.tempList
      .map((item) => Object.keys(item.assetDetails || {}))
      .flat();
    this.masterDetailKeys = Array.from(new Set(allKeys)).filter((key) => key !== 'refId');
  }

  // Remove an asset from the temporary list
  removeFromList(index: number): void {
    this.tempList.splice(index, 1);
  }

  // Reset the form to its default values
  resetForm(): void {
    this.formData = {
      mabAssetId: '',
      assetSerialNo: '',
      wifiAccess: 'No',
      gpAccess: 'No',
      remarks: '',
      categoryId: null,
      categoryName: null,
    };
  }

  // Save the list of assets to the server
  saveAssets(): void {
    if (this.isExistingAsset || this.tempList.length !== 0) {
      const payload = this.tempList.map((item) => {
        const assetDetails = item.assetDetails || {};
        return {
          userId: null, // Set dynamically if applicable
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
      this.assetService.saveAssignedAssets({ assets: payload }).subscribe({
        next: (response) => {
          this.tempList = [];
          this.fetchExistingAssets(); // Re-fetch the assets after saving
          this.dialog.open(GeneralPopupComponent, {
            data: { header: 'Info', message: response.message },
          });
        },
        error: (error) => {
          console.error('Error saving assets:', error);
        },
      });
    }else{
      this.dialog.open(GeneralPopupComponent, {
        data: { header: 'Info', message: "Please add one or more asset" },
      });
    }
  }
}
