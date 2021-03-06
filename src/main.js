var app = new Vue({
    el: '#app',
    data(){
        return{
            pageLoaded: false,
            productsLoading: true,
            initialProducts: [],
            products: [],
            errors: [],
            randomProductImageKey: 0,
            state: {},
            filterActive: {
                category: [],
                value: []
            },
            filteredProducts: [],
            sortActive: {
                category: 'price',
                value: 'asc'
            },
            sortedProducts: [],
            discount: false,
            discountValue: ''
        }
    },
    created() {
        axios.get(`https://cosminfratila.github.io/products.json`)
        .then(response => {
            // JSON responses are automatically parsed.
            this.initialProducts = response.data.produse;
            this.products = response.data.produse;
        })
        .catch(e => {
            this.errors.push(e)
        });

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const discount = urlParams.get('discount');

        if (discount) {
            this.setDiscount(discount);
        }
    },
    computed: {
        getFilterInitialData() {
            let initialFilterData = {};
            let categsArray = [];
            let sectionsArray = [];
            let colorsArray = [];
            let materialsArray = [];
            let sizesArray = [];
            let brandsArray = [];

            _.forEach(this.products, function(value, key) {
                categsArray.push(value.categorie);
                sectionsArray.push(value.sectiune);
                colorsArray.push(value.culoare);
                materialsArray.push(value.material);
                sizesArray = [...sizesArray, ...Object.keys(value.marimi)];
                brandsArray.push(value.brand);
            });

            initialFilterData.categories = categsArray.filter((value, index, self) => {
                return self.indexOf(value) === index;
            });
            initialFilterData.sections = sectionsArray.filter((value, index, self) => {
                return self.indexOf(value) === index;
            });
            initialFilterData.colors = colorsArray.filter((value, index, self) => {
                return self.indexOf(value) === index;
            });
            initialFilterData.materials = materialsArray.filter((value, index, self) => {
                return self.indexOf(value) === index;
            });
            initialFilterData.sizes = sizesArray.filter((value, index, self) => {
                return self.indexOf(value) === index;
            });
            initialFilterData.brands = brandsArray.filter((value, index, self) => {
                return self.indexOf(value) === index;
            });

            return initialFilterData;
        }
    },
    mounted() {
        this.randomProductImageKey = Math.floor(Math.random() * 8);
        setTimeout(() => {
            this.pageLoaded = true;
            this.productsLoading = false;
        }, 500);
    },
    methods: {
        sectionsFormat(section) {
            if (section === 'Femei') {
                return 'Feminin';
            }
            if (section === 'Barbati') {
                return 'Masculin';
            }
        },

        updateFilter(filterCategory, filterValue) {
            this.productsLoading = true;

            if (!_.includes(this.filterActive.value, filterValue)) {
                this.filterActive.value.push(filterValue);
                this.filterActive.category.push(filterCategory);
            } else {
                _.pull(this.filterActive.value, filterValue);
                _.pull(this.filterActive.category, filterCategory);
            }

            if (this.filterActive.category.length > 0) {
                this.filteredProducts = _.filter(this.products, function(product) {
                    if (filterCategory === 'marimi') {
                        if (product[filterCategory][filterValue] > 0) {
                            return product;
                        }
                    } else {
                        if (_.includes(product[filterCategory], filterValue)) {
                            return product;
                        }
                    }
                });

                this.products = this.filteredProducts;
            } else {
                this.products = this.initialProducts;
            }

            setTimeout(() => {
                this.productsLoading = false;
            }, 500);
        },

        updateSort(sortCategory, sortValue) {
            /*TODO make sort*/

            this.productsLoading = true;

            console.log(sortCategory);
            console.log(sortValue);

            this.sortActive.value = sortValue;
            this.sortActive.category = sortCategory;

            setTimeout(() => {
                this.productsLoading = false;
            }, 500);
        },

        setDiscount(discount) {
            if ( discount > 0 && discount <= 100 ) {
                this.discount = true;
                this.discountValue = discount;
            } else {
                this.discount = false;
                console.error('Discount error');
            }
        },

        getPriceWithDiscount(price) {
            let newPrice = 0;

            newPrice = Math.floor(((100 - this.discountValue) * price) / 100);

            return newPrice;
        }

        /*randomProductImageKey(max) {
            /!*return Math.floor(Math.random() * max);*!/
        }*/
    }
});
