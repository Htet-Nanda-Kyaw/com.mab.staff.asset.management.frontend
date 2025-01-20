import { Component, OnInit } from '@angular/core';
import { AssetService } from '../services/asset/asset.service';

interface FormData {
  mabAssetId: string;
  assetSerialNo: string;
  wifiAccess: string;
  gpAccess: string;
  selectedAsset?: any;
  assetDetails?: any; // Store selected asset details here
  remarks?: string; // Add remarks field
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

  formData: FormData = {
    mabAssetId: '',
    assetSerialNo: '',
    wifiAccess: 'No',
    gpAccess: 'No',
    remarks: '', // Initialize remarks
  };

  constructor(private assetService: AssetService) { }

  ngOnInit(): void {
    this.fetchCategories();
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
        endpoint = '/ref_laptop/search_all';
        break;
      case 'hard disk drive external':
        endpoint = '/ref_hard_disk/search_all';
        break;
      case 'monitor':
        endpoint = '/ref_external_monitor/search_all';
        break;
      case 'printer':
        endpoint = '/ref_printer/search_all';
        break;
      case 'scanner':
        endpoint = '/ref_scanner/search_all';
        break;
      case 'ups':
        endpoint = '/ref_ups/search_all';
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

  // Add current form data to the temporary list
  // Add current form data and asset details to the temporary list
  addToList(): void {
    if (this.formData.mabAssetId && this.formData.assetSerialNo) {
      this.tempList.push({ ...this.formData });

      // Update master detail keys
      this.updateMasterDetailKeys();

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
    };
  }

  // Save assets to the server
  saveAssets(): void {
    const payload = { assets: this.tempList };

    this.assetService.saveAssignedAssets(payload).subscribe({
      next: () => {
        alert('Assets saved successfully!');
        this.tempList = [];
      },
      error: (error) => {
        console.error('Error saving assets:', error);
      },
    });
  }
}
