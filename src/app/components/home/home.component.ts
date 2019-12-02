import { Component, OnInit, HostListener, TemplateRef } from '@angular/core';
import { MetaService } from '@ngx-meta/core';
import { FormBuilder, FormGroup, Validators,FormArray } from '@angular/forms';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {ApiService} from '../../api-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  modalRef: BsModalRef;
  windowScrolled: boolean;
  public signUpform: FormGroup;
  public successmodal: any = false;
  public stateslist: any;
  public citylist:any;
  public ready: any;
  public imgval: any;
  public imagemodal: any = 1;
  public ErrCode:boolean;
  public collect_phone_array:any=[];
  public collect_email_array:any=[];
  public api_url:any = this.apiService.api_url;
  // public api_url: any = 'https://r245816wug.execute-api.us-east-1.amazonaws.com/dev/api/';

  constructor(public apiService:ApiService,public router: Router, public activatedroute: ActivatedRoute, private readonly meta: MetaService, public formBuilder: FormBuilder, public http: HttpClient, private modalService: BsModalService, public cookieservice: CookieService) {


    this.getState();
    this.getCity();
    if (this.cookieservice.check('jwttoken') == false) {
      this.setTempToken();
    }

    this.signUpform = this.formBuilder.group({
      hospitalname: ['', Validators.required],
      contactperson: ['', Validators.required],
      email:['', [Validators.required, Validators.pattern(/^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/)]],
      password: ['',Validators.required],
      contactphones:['',Validators.required],
      confirmpassword:['',Validators.required],
      address: ['', Validators.required],
      city: ['',Validators.required],
      state: ['', Validators.required],
      speciality:['',Validators.required],
      zip:['',Validators.required],
      salesrepselect: this.activatedroute.snapshot.params.repid,
      type: ['hospital'],
      status:0, 
    },{
        validator: this.machpassword('password', 'confirmpassword')
    })
  }
  setTempToken() {
    const link = this.api_url + 'temptoken';
    this.http.post(link, {}).subscribe(res => {
      let result: any = res;
      this.cookieservice.set('jwttoken', result.token);

    });


  }
  //collecting mass phones
  collect_phones(event: any) {
    if (event.keyCode == 13) {
      this.collect_phone_array.push(event.target.value);
      this.signUpform.controls['contactphones'].patchValue("");
      return;
    }
  }
   //delete mass phone
   clearPhones(index) {
    this.collect_phone_array.splice(index, 1);
  }

   //collecting mass emails
  //  collect_email(event: any) {
  //   if (event.keyCode == 13) {
  //     this.collect_email_array.push(event.target.value);
  //     this.signUpform.controls['contactemails'].patchValue("");
  //     return;
  //   }
  // }

  //  //delete mass email
  //  clearEmail(index) {
  //   this.collect_email_array.splice(index, 1);
  // }
  //  =====================Image Upload Configuration====================
  // public configData: any = {
  //   baseUrl: "http://3.15.236.141:5005/",
  //   endpoint: "uploads",
  //   size: "51200", // kb
  //   format: ["jpg", "jpeg", "png"], // use all small font
  //   type: "med_partner_img",
  //   path: "files",
  //   prefix: "medpartner_picture_"
  // }

  //  ==================================================================

  scrollToTop() {
    (function smoothscroll() {

      var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;

      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - (currentScroll / 8));
      }

    })();
  }

  @HostListener("window:scroll", [])

  onWindowScroll() {
    if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) {
      this.windowScrolled = true;
    }
    else if (this.windowScrolled && window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop < 10) {
      this.windowScrolled = false;
    }
  }

  toTop() {
    document.getElementById("nmsfunneldoctor_formblock").scrollIntoView({ behavior: 'smooth' });
  }

  ngOnInit() {
    this.router.events.subscribe(() =>
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    );

    this.meta.setTitle('MD Stock International - Your Medical Partner');
    this.meta.setTag('og:description', 'MD Stock International is the Medical Equipment & Supplies Partner you want for Top-Quality On-Demand Supplies, Direct-to-Manufacturer Purchases and much more.');
    this.meta.setTag('og:title', 'MD Stock International - Your Medical Partner');
    this.meta.setTag('og:type', 'website');
    this.meta.setTag('og:url', 'https://mdstockint.com/');
    this.meta.setTag('og:image', 'https://mdstockint.com/assets/images/MDStockFacebookBanner.jpg');

  }
/**fetch json state and city */
  getState() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    var result = this.http.get('assets/data/state.json').subscribe(res => {
      this.stateslist = res;
      //console.log('stateslist');
     // console.log(this.stateslist);

    });
    return result;
  }
  getCity(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    var result = this.http.get('assets/data/usa-cities.json').subscribe(res => {
      this.citylist = res;
    //   console.log('citylist');
    //  console.log(this.citylist);

    });
    return result;
  }


/**Miss Match password check function */
machpassword(passwordkye: string, confirmpasswordkye: string) {
  return (group: FormGroup) => {
    let passwordInput = group.controls[passwordkye],
      confirmpasswordInput = group.controls[confirmpasswordkye];
    if (passwordInput.value !== confirmpasswordInput.value) {
      return confirmpasswordInput.setErrors({ notEquivalent: true });
    }
    else {
      return confirmpasswordInput.setErrors(null);
    }
  };
}

/**submit function */
  doSubmit(template: TemplateRef<any>) {
    //     if (this.configData.files) {

    //   if (this.configData.files.length > 1)
    //    { 
    //      console.log("Errcode");
    //      this.ErrCode = true; return; 
    //   }
    //   this.signUpform.value.mpimage =
    //     {
    //       "basepath": this.configData.files[0].upload.data.basepath + '/' + this.configData.path + '/',
    //       "image": this.configData.files[0].upload.data.data.fileservername,
    //       "name": this.configData.files[0].name,
    //       "type": this.configData.files[0].type
    //     };
    // } else {
    //   this.signUpform.value.mpimage = false;
    // }

    // console.log(this.ErrCode);
    // console.log(this.signUpform.value);

    for (let i in this.signUpform.controls) {
      this.signUpform.controls[i].markAsTouched();
    }

    /**Submit start here */
    if (this.signUpform.valid) {
      if(this.signUpform.value.confirmpassword != null){
        delete this.signUpform.value.confirmpassword;
      }
      
      let data: any = {
        "source": "users",
        "data": this.signUpform.value,
        "sourceobj": ["salesrepselect"],
      };
      //console.log(this.cookieservice.get('jwttoken'));
      // this.successmodal = true;
      this.apiService.postData('addorupdatedata', data).subscribe(res => {

          let result: any = {};
          result = res;
          console.log(result);
          if (result.status == 'success') {

            this.modalRef = this.modalService.show(template, { class: 'modal-md submitpopup' });
            this.signUpform.reset();

            setTimeout(() => {

              // this.successmodal = true;
              // console.log(this.successmodal)
              this.modalRef.hide();
            }, 3000);
          }
        })
    }
  }




  closep() {
    this.modalRef.hide();
  }

  inputUntouch(form: any, val: any) {
    //console.log('on blur .....');
    form.controls[val].markAsUntouched();
  }


  openmodal(img: any, template: TemplateRef<any>) {

    this.modalRef = this.modalService.show(template, { class: 'modal-lg submitpopup' });
    this.imgval = img;
  }

  // agent array list
  partnerList = [
    { "id": 0, "name": "United Hospital Supply Corporation ", "details": "Design & Fabrication of Pharmacy & Laboratory Furniture" },
    { "id": 1, "name": "J.T. Baker ", "details": "Worldwide Producer of Laboratory, Biotechnology and Pharmaceuticals, Specialty Industrial and Microelectronic Chemicals" },
    { "id": 2, "name": "Kimble / Kontes ", "details": "World Class Laboratory Glassware (Reusable, Disposable and Specialty Glassware)" },
    { "id": 3, "name": "Advanced Instrumentations Inc ", "details": " First Class Medical Equipment" },
    { "id": 4, "name": "Adam Equipment", "details": " Suppliers of Balances, Scales and Weighing Equipment for Laboratory Medical and Industrial Use" },
    { "id": 5, "name": "A J Cope & Sons Ltd", "details": " Suppliers of Labware, Laboratory Products, Laboratory Consumables and Scientific Equipment" },
    { "id": 6, "name": "Pride Corporation", "details": " Over-the-counter Drugs and General Merchandize" },
    { "id": 7, "name": "Genetics Pharmaceuticals", "details": " Manufacturers of Pharmaceuticals" },
    { "id": 8, "name": "Dynarex Corp", "details": " Manufacturers and Distributors of Disposable Medical Supplies" },
    { "id": 9, "name": "Macs Pharmaceuticals and Cosmetics", "details": "  Manufacturers of Pharmaceutical and Cosmetic Supplies" },
    { "id": 10, "name": "Harvard Drug Group ", "details": "  Manufacturers of Pharmaceuticals " },
    { "id": 11, "name": "American Diagnostics Corporation", "details": "  Supplier of Stethoscopes and Blood Pressure Instruments " },
    { "id": 12, "name": "Pharmasupply ", "details": "Manufacturers of Glucose Meters and Blood Pressures Instruments" },
    { "id": 13, "name": "MD Science", "details": "Manufacturers of Multivitamins" },
    { "id": 14, "name": "Bio Nuclear Diagnostic", "details": "Manufacturer and Distributor of Medical, Diagnostic and Laboratory Supplies" },
    { "id": 15, "name": "Nalgene ", "details": "Manufacturer and Distributor of durable, break-resistant, light weight Labware (Beakers, Bottles, Glass Carboys, filters …)" },
    { "id": 16, "name": "Ansell  ", "details": "Global Leader in Healthcare Barrier Protection Products (Condoms, Gloves, Aprons …)" },
    { "id": 17, "name": "Hach", "details": " Global Company in Water Quality Testing and Analysis, Offers Portable Laboratory and Online Instrumentation.  Manufacturer and Distributor of Reagents used to Test Water Quality and Other Aqueous Solutions " },
    { "id": 18, "name": "Labconco ", "details": "Provides Laboratory Equipment including Chemical Fume Hoods, HEPA Filtered Safety Cabinets, Carbon Filtered and Laboratory Animal Enclosures – Glassware Washers, Carts and Benches & Water Purification System " },
    { "id": 19, "name": "Lab Safety Supplies (LSS) ", "details": " Distributor of a Variety of Safety Products, Material Handling, Industrial and Laboratory Supplies" },
    { "id": 20, "name": "Ben Meadows", "details": " Distributor of Forestry Supplies, Surveying Equipment, GPS Navigation etc. " },
    { "id": 21, "name": "ThermoFisher Scientific", "details": "  Fisher Scientific - Complete Portfolio of Laboratory Equipment, Chemicals, Supplies and Services for Research, Safety, Healthcare and Science Education" },
    { "id": 22, "name": "VWR International", "details": "Manufacturer and Distributor of Laboratory Necessities, Chemicals, Furniture, Lifer Science, Bioscience, Safety Chromatography, Controlled Environment & Clinical Healthcare" },
    { "id": 23, "name": "Cole Parmer", "details": "A Leading Global Source of Laboratory and Industrial Fluid Handling Products, Instrumentation, Equipment and Supplies. Proven Experts in the Fields of Temperature Measurement and Control, Electrochemistry, and Fluid Handling" },
    { "id": 24, "name": "Phillips Avent", "details": " Manufacturers of a Full Range of Baby Products" },
    { "id": 25, "name": "Genthics Pharmaceuticals", "details": " Manufactures Over-the-counter Drugs and Prescription drugs" },
    { "id": 26, "name": "Nipro Diagnostic", "details": "(Formerly Home Diagnostic Ltd)- Manufacturers of Glucometers and Diabetic Care Products" },
    { "id": 27, "name": "Invacare", "details": " Manufacturers and Distributors of Medical Supplies, Instruments and Equipment" },
    { "id": 28, "name": "Welch Allyn", "details": "Manufacturers of Diagnostics, Equipments and Instruments" },
    { "id": 29, "name": "Hi Media", "details": " Manufacturers of Microbiology Laboratory Products" },
    { "id": 30, "name": "Polyscience", "details": "Manufacturers of Chillers and Circulators" },
    { "id": 31, "name": "Harvard Drug Group", "details": "Manufacturers and Distributors of a Comprehensive Range of Pharmaceuticals Including Over-the-counter Drugs, Prescription Drugs, Dermatology and Ophthalmology " }


  ];
  public data: any = '';
  showDetails(item: any, template: TemplateRef<any>) {
    // console.log(template);
    // console.log(item);
    this.data = item;
    // console.log(this.data)
    this.modalRef = this.modalService.show(template, { class: 'show_modal' });
  }


}
