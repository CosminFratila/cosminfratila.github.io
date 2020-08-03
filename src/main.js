var app = new Vue({
    el: '#app',
    data(){
        return{
            pageLoaded: false,
            productsLoading: true,
            products: [],
            errors: [],
            randomProductImageKey: 0,
            state: {},
            filterActive: {
                category: [],
                value: []
            },
            filteredProducts: []
        }
    },
    created() {
        axios.get(`https://cosminfratila.github.io/products.json`)
        .then(response => {
            // JSON responses are automatically parsed.
            this.products = response.data.produse
        })
        .catch(e => {
            this.errors.push(e)
        })
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
        this.pageLoaded = true;
        this.productsLoading = false;
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
                console.log('Show initial products');
            }

            setTimeout(() => {
                this.productsLoading = false;
            }, 500);
        }

        /*randomProductImageKey(max) {
            /!*return Math.floor(Math.random() * max);*!/
        }*/
    }
});
