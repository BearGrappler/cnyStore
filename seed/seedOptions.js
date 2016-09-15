var baseArray = [1, 2, 3, 4];
var ramArray = [5, 6, 7, 8, 9, 10];
var cpuArray = [11, 12, 13, 14, 15];
var storageArray = [16, 17, 18, 19];
var gpuArray = [20, 21, 22, 23];

seedArray = [];

baseArray.forEach(base => {
    ramArray.forEach((ram, index) => {
        seedArray.push({
            baseId: base,
            type: 'ram',
            upgradeId: ram,
            defOption: index === 0
        })
    });
    cpuArray.forEach((cpu, index) => {
        seedArray.push({
            baseId: base,
            type: 'cpu',
            upgradeId: cpu,
            defOption: index === 0
        })
    });
    storageArray.forEach((storage, index) => {
        seedArray.push({
            baseId: base,
            type: 'hdd',
            upgradeId: storage,
            defOption: index === 0
        })
    });
    gpuArray.forEach((gpu, index) => {
        seedArray.push({
            baseId: base,
            type: 'gpu',
            upgradeId: gpu,
            defOption: index === 0
        })
    });
})

module.exports = seedArray;
