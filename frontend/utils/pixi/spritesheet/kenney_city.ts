import { SpriteSheetTile } from './spritesheet'
import { SpriteSheetData } from './SpriteSheetData'

const width = 926
const height = 2033
const url = '/sprites/spritesheets/kenney_city.png'

const sprites: SpriteSheetTile[] = [
    {
        name: 'cityDetails_000',
        x: 125,
        y: 64,
        width: 22,
        height: 37,
        layer: 'object',
        colliders: [{ x: 0, y: 1 }]
    },
    {
        name: 'cityDetails_001',
        x: 71,
        y: 45,
        width: 32,
        height: 32,
        layer: 'object',
        colliders: [{ x: 0, y: 0 }]
    },
    {
        name: 'cityDetails_002',
        x: 71,
        y: 77,
        width: 32,
        height: 32,
        layer: 'object',
        colliders: [{ x: 0, y: 0 }]
    },
    {
        name: 'cityDetails_003',
        x: 103,
        y: 32,
        width: 32,
        height: 32,
        layer: 'object',
        colliders: [{ x: 0, y: 0 }]
    },
    {
        name: 'cityDetails_004',
        x: 103,
        y: 0,
        width: 32,
        height: 32,
        layer: 'object',
        colliders: [{ x: 0, y: 0 }]
    },
    {
        name: 'cityDetails_005',
        x: 147,
        y: 46,
        width: 22,
        height: 46,
        layer: 'object',
        colliders: [{ x: 0, y: 1 }]
    },
    {
        name: 'cityDetails_006',
        x: 135,
        y: 0,
        width: 22,
        height: 46,
        layer: 'object',
        colliders: [{ x: 0, y: 1 }]
    },
    {
        name: 'cityDetails_007',
        x: 103,
        y: 64,
        width: 22,
        height: 37,
        layer: 'object',
        colliders: [{ x: 0, y: 1 }]
    },
    {
        name: 'cityDetails_008',
        x: 0,
        y: 64,
        width: 71,
        height: 63,
        layer: 'object',
        colliders: [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }]
    },
    {
        name: 'cityDetails_009',
        x: 0,
        y: 0,
        width: 71,
        height: 64,
        layer: 'object',
        colliders: [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }]
    },
    {
        name: 'cityDetails_010',
        x: 71,
        y: 0,
        width: 32,
        height: 45,
        layer: 'object',
        colliders: [{ x: 0, y: 1 }]
    },
    {
        name: 'cityTiles_000',
        x: 398,
        y: 116,
        width: 132,
        height: 104,
        layer: 'floor'
    },
    {
        name: 'cityTiles_001',
        x: 794,
        y: 737,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_002',
        x: 794,
        y: 636,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_003',
        x: 794,
        y: 535,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_004',
        x: 794,
        y: 407,
        width: 132,
        height: 128,
        layer: 'floor'
    },
    {
        name: 'cityTiles_005',
        x: 794,
        y: 306,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_006',
        x: 794,
        y: 202,
        width: 132,
        height: 104,
        layer: 'floor'
    },
    {
        name: 'cityTiles_007',
        x: 794,
        y: 101,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_008',
        x: 133,
        y: 1208,
        width: 133,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_009',
        x: 793,
        y: 1929,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_010',
        x: 793,
        y: 1828,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_011',
        x: 793,
        y: 1700,
        width: 132,
        height: 128,
        layer: 'floor'
    },
    {
        name: 'cityTiles_012',
        x: 793,
        y: 1572,
        width: 132,
        height: 128,
        layer: 'floor'
    },
    {
        name: 'cityTiles_013',
        x: 0,
        y: 101,
        width: 133,
        height: 133,
        layer: 'floor'
    },
    {
        name: 'cityTiles_014',
        x: 793,
        y: 1370,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_015',
        x: 793,
        y: 1269,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_016',
        x: 793,
        y: 1168,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_017',
        x: 662,
        y: 1067,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_018',
        x: 0,
        y: 234,
        width: 133,
        height: 133,
        layer: 'floor'
    },
    {
        name: 'cityTiles_019',
        x: 0,
        y: 367,
        width: 133,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_020',
        x: 662,
        y: 766,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_021',
        x: 662,
        y: 665,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_022',
        x: 662,
        y: 564,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_023',
        x: 662,
        y: 436,
        width: 132,
        height: 128,
        layer: 'floor'
    },
    {
        name: 'cityTiles_024',
        x: 662,
        y: 303,
        width: 132,
        height: 133,
        layer: 'floor'
    },
    {
        name: 'cityTiles_025',
        x: 0,
        y: 569,
        width: 133,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_026',
        x: 0,
        y: 769,
        width: 133,
        height: 133,
        layer: 'floor'
    },
    {
        name: 'cityTiles_027',
        x: 662,
        y: 0,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_028',
        x: 661,
        y: 1932,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_029',
        x: 661,
        y: 1831,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_030',
        x: 661,
        y: 1730,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_031',
        x: 661,
        y: 1597,
        width: 132,
        height: 133,
        layer: 'floor'
    },
    {
        name: 'cityTiles_032',
        x: 0,
        y: 902,
        width: 133,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_033',
        x: 0,
        y: 1003,
        width: 133,
        height: 133,
        layer: 'floor'
    },
    {
        name: 'cityTiles_034',
        x: 661,
        y: 1256,
        width: 132,
        height: 127,
        layer: 'floor'
    },
    {
        name: 'cityTiles_035',
        x: 530,
        y: 1155,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_036',
        x: 530,
        y: 1032,
        width: 132,
        height: 123,
        layer: 'floor'
    },
    {
        name: 'cityTiles_037',
        x: 530,
        y: 931,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_038',
        x: 530,
        y: 830,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_039',
        x: 530,
        y: 729,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_040',
        x: 0,
        y: 1237,
        width: 133,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_041',
        x: 0,
        y: 1843,
        width: 133,
        height: 127,
        layer: 'floor'
    },
    {
        name: 'cityTiles_042',
        x: 530,
        y: 426,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_043',
        x: 530,
        y: 325,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_044',
        x: 530,
        y: 202,
        width: 132,
        height: 123,
        layer: 'floor'
    },
    {
        name: 'cityTiles_045',
        x: 530,
        y: 101,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_046',
        x: 530,
        y: 0,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_047',
        x: 0,
        y: 1439,
        width: 133,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_048',
        x: 0,
        y: 1742,
        width: 133,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_049',
        x: 529,
        y: 1722,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_050',
        x: 529,
        y: 1621,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_051',
        x: 529,
        y: 1520,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_052',
        x: 529,
        y: 1419,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_053',
        x: 529,
        y: 1318,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_054',
        x: 398,
        y: 1217,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_055',
        x: 133,
        y: 604,
        width: 133,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_056',
        x: 133,
        y: 1006,
        width: 133,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_057',
        x: 398,
        y: 888,
        width: 132,
        height: 115,
        layer: 'floor'
    },
    {
        name: 'cityTiles_058',
        x: 398,
        y: 757,
        width: 132,
        height: 131,
        layer: 'floor'
    },
    {
        name: 'cityTiles_059',
        x: 398,
        y: 656,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_060',
        x: 398,
        y: 555,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_061',
        x: 398,
        y: 454,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_062',
        x: 133,
        y: 1309,
        width: 133,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_063',
        x: 133,
        y: 1107,
        width: 133,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_064',
        x: 794,
        y: 838,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_065',
        x: 398,
        y: 0,
        width: 132,
        height: 116,
        layer: 'floor'
    },
    {
        name: 'cityTiles_066',
        x: 397,
        y: 1916,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_067',
        x: 397,
        y: 1803,
        width: 132,
        height: 113,
        layer: 'floor'
    },
    {
        name: 'cityTiles_068',
        x: 794,
        y: 0,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_069',
        x: 793,
        y: 1471,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_070',
        x: 0,
        y: 0,
        width: 133,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_071',
        x: 0,
        y: 468,
        width: 133,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_072',
        x: 662,
        y: 968,
        width: 132,
        height: 99,
        layer: 'floor'
    },
    {
        name: 'cityTiles_073',
        x: 662,
        y: 101,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_074',
        x: 662,
        y: 202,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_075',
        x: 661,
        y: 1383,
        width: 132,
        height: 113,
        layer: 'floor'
    },
    {
        name: 'cityTiles_076',
        x: 661,
        y: 1496,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_077',
        x: 133,
        y: 705,
        width: 133,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_078',
        x: 0,
        y: 1338,
        width: 133,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_079',
        x: 530,
        y: 628,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_080',
        x: 266,
        y: 436,
        width: 132,
        height: 99,
        layer: 'floor'
    },
    {
        name: 'cityTiles_081',
        x: 529,
        y: 1924,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_082',
        x: 398,
        y: 1116,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_083',
        x: 398,
        y: 1003,
        width: 132,
        height: 113,
        layer: 'floor'
    },
    {
        name: 'cityTiles_084',
        x: 266,
        y: 0,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_085',
        x: 133,
        y: 101,
        width: 133,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_086',
        x: 133,
        y: 0,
        width: 133,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_087',
        x: 265,
        y: 1713,
        width: 132,
        height: 99,
        layer: 'floor'
    },
    {
        name: 'cityTiles_088',
        x: 397,
        y: 1702,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_089',
        x: 265,
        y: 1511,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_090',
        x: 265,
        y: 1410,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_091',
        x: 266,
        y: 737,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_092',
        x: 133,
        y: 402,
        width: 133,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_093',
        x: 133,
        y: 503,
        width: 133,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_094',
        x: 265,
        y: 1812,
        width: 132,
        height: 99,
        layer: 'floor'
    },
    {
        name: 'cityTiles_095',
        x: 265,
        y: 1612,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_096',
        x: 133,
        y: 1612,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_097',
        x: 133,
        y: 1713,
        width: 132,
        height: 133,
        layer: 'floor'
    },
    {
        name: 'cityTiles_098',
        x: 133,
        y: 1410,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_099',
        x: 133,
        y: 1511,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_100',
        x: 133,
        y: 905,
        width: 133,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_101',
        x: 133,
        y: 806,
        width: 133,
        height: 99,
        layer: 'floor'
    },
    {
        name: 'cityTiles_102',
        x: 266,
        y: 101,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_103',
        x: 266,
        y: 202,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_104',
        x: 265,
        y: 1911,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_105',
        x: 133,
        y: 1846,
        width: 132,
        height: 133,
        layer: 'floor'
    },
    {
        name: 'cityTiles_106',
        x: 133,
        y: 301,
        width: 133,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_107',
        x: 133,
        y: 202,
        width: 133,
        height: 99,
        layer: 'floor'
    },
    {
        name: 'cityTiles_108',
        x: 398,
        y: 220,
        width: 132,
        height: 133,
        layer: 'floor'
    },
    {
        name: 'cityTiles_109',
        x: 398,
        y: 353,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_110',
        x: 266,
        y: 535,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_111',
        x: 529,
        y: 1823,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_112',
        x: 0,
        y: 1641,
        width: 133,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_113',
        x: 0,
        y: 1540,
        width: 133,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_114',
        x: 266,
        y: 303,
        width: 132,
        height: 133,
        layer: 'floor'
    },
    {
        name: 'cityTiles_115',
        x: 266,
        y: 636,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_116',
        x: 530,
        y: 527,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_117',
        x: 0,
        y: 1136,
        width: 133,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_118',
        x: 266,
        y: 967,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_119',
        x: 266,
        y: 838,
        width: 132,
        height: 129,
        layer: 'floor'
    },
    {
        name: 'cityTiles_120',
        x: 266,
        y: 1169,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_121',
        x: 0,
        y: 670,
        width: 133,
        height: 99,
        layer: 'floor'
    },
    {
        name: 'cityTiles_122',
        x: 266,
        y: 1068,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_123',
        x: 397,
        y: 1371,
        width: 132,
        height: 129,
        layer: 'floor'
    },
    {
        name: 'cityTiles_124',
        x: 662,
        y: 867,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_125',
        x: 266,
        y: 1270,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_126',
        x: 397,
        y: 1601,
        width: 132,
        height: 101,
        layer: 'floor'
    },
    {
        name: 'cityTiles_127',
        x: 397,
        y: 1500,
        width: 132,
        height: 101,
        layer: 'floor'
    }
]

const kenney_citySpriteSheetData = new SpriteSheetData(
    width,
    height,
    url,
    sprites
)

export { kenney_citySpriteSheetData }
