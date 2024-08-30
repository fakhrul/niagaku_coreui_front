<template>
  <div>
    <!-- <context-menu :display="showContextMenu" ref="menu">
      <ul>
        <li @click="contextEndDrawingAndContinue">End and continue</li>
        <li @click="contextEndDrawing">End drawing</li>
      </ul>
    </context-menu> -->

    <CToaster :autohide="3000">
      <template v-for="info in infoList">
        <CToast
          :key="info.message"
          :show="true"
          :header="info.header"
          :color="info.color"
        >
          {{ info.message }}.
        </CToast>
      </template>
    </CToaster>
    <div class="work-component" v-if="showComponent">
      <WorkComponents
        :obj="obj"
        @roomClick="roomSettingClick"
        @doorClick="doorSettingClick"
        @exitAreaClick="exitAreaSettingClick"
        @exitStairWidthClick="exitStairWidthSettingClick"
        @exitDoorClick="exitDoorSettingClick"
        @exitSeperationClick="exitSeperationSettingClick"
        @diagonalDistanceClick="diagonalDistanceSettingClick"
        @commonPathClick="commonPathSettingClick"
        @travelDistanceClick="travelDistanceSettingClick"
        @obstacleClick="obstacleSettingClick"
      />
    </div>
    <div>
      <WpTopRight
        class="top-right"
        @showComponentList="showComponentList"
      ></WpTopRight>
      <WpMenuLeft
        class="mid-left"
        @roomClick="toolClick('room')"
        @roomRectClick="toolClick('roomRect')"
        @roomAutoClick="toolClick('roomAuto')"
        @doorClick="toolClick('doors')"
        @doorVerticalClick="toolClick('doorVertical')"
        @doorHorizontalClick="toolClick('doorHorizontal')"
        @stairClick="toolClick('stairExit')"
        @stairRectClick="toolClick('stairExitRect')"
        @stairWidthClick="toolClick('exitStairWidth')"
        @exitSeperationClick="toolClick('exitSeparation')"
        @diagonalDistanceClick="toolClick('diagonalDistance')"
        @travelDistanceClick="toolClick('travelDistance')"
        @travelDistanceAutoClick="toolClick('travelDistanceAuto')"
        @commonPathClick="toolClick('commonPath')"
        @deadEndClick="toolClick('deadEnd')"
        @obstacleClick="toolClick('obstacle')"
        @obstacleRectClick="toolClick('obstacleRect')"
        @obstacleAutoClick="toolClick('obstacleAuto')"
        @exitDoorClick="toolClick('exitDoor')"
        @exitDoorVerticalClick="toolClick('exitDoorVertical')"
        @exitDoorHorizontalClick="toolClick('exitDoorHorizontal')"
        @corridorEndClick="toolClick('corridorEnd')"
        @corridorEndRectClick="toolClick('corridorEndRect')"
        @cancelClick="toolClick('cancel')"
        @showGridUpdateClick="showGridUpdateClick"
        @gridSizeUpdateClick="gridSizeUpdateClick"
        @travelDistanceClearClick="travelDistanceClearClick"
        :drawingMeta="drawingMeta"
      >
      </WpMenuLeft>
      <!-- <WpBottomLeft class="bottom-left"></WpBottomLeft> -->
      <WpBottomMid
        class="bottom-mid"
        :scale="obj.scale"
        @scaleClick="toolScaleClick"
      ></WpBottomMid>
      <!-- <DrawingInfo class="bottom-right"></DrawingInfo> -->

      <WpQuickTool
        class="top-mid"
        @save="quickSave"
        @clear="quickClear"
        @undo="handlePrevStep"
        @redo="handleNextStep"
        @reload="quickReload"
      ></WpQuickTool>
      <WpZoom
        class="bottom-right"
        @zoomIn="zoomIn"
        @zoomReset="zoomReset"
        @zoomOut="zoomOut"
      ></WpZoom>

      <v-stage
        ref="stage"
        :config="stageSize"
        :style="{
          top: 0,
          //   backgroundColor: 'gray',
          //   borderWidth: '2px',
          //   borderStyle: 'solid',
          //   borderColor: 'blue',
          overflow: 'auto',
        }"
        @click="handleStageMouseClick"
        @contextmenu="onContextMenu"
        @mousedown="handleStageMouseDown"
        @mouseup="handleStageMouseUp"
        @mousemove="handleStageMouseMove"
      >
        <v-layer>
          <!-- <v-circle :config="configCircle"></v-circle> -->
          <v-image
            ref="image"
            :config="{
              x: 0,
              y: 0,
              image: image,
            }"
          />
          <template v-for="(item, index) in rooms">
            <v-line
              :key="item.code"
              :config="item"
              @mousemove="onMouseMove(item)"
              @mouseout="onMouseOut"
              @click="roomLabelClick(item)"
            />
            <v-circle
              v-for="anchor in getAnchors(item)"
              @dragmove="updatePoly"
              :key="anchor.code"
              :config="{
                roomId: anchor.roomId,
                roomCode: anchor.roomCode,
                pointFirstIndex: anchor.pointFirstIndex,
                code: anchor.code,
                x: anchor.x,
                y: anchor.y,
                radius: 4,
                fill: 'white',
                stroke: 'black',
                draggable: true,
              }"
            />

            <v-label
              :key="item.code + 'label'"
              :config="{
                x: getCenterOfShape(item.points)[0], // item.points[0],
                y: getCenterOfShape(item.points)[1], //item.points[1],
              }"
              @click="roomLabelClick(item)"
            >
              <v-text
                :config="{
                  text: getRoomInfo(item),
                  fill: 'green',
                }"
              />
            </v-label>
          </template>

          <template v-for="(item, index) in obstacles">
            <v-line
              :key="item.code"
              :config="item"
              @click="obstacleLabelClick(item)"
            />
            <!-- <v-label
                        :key="item.code + 'label'"
                        :config="{
                          x: item.points[0],
                          y: item.points[1],
                        }"
                        @click="obstacleSettingClick(item)"
                      >
                        <v-text
                          :config="{
                            text: getRoomInfo(item),
                            fill: 'green',
                            padding: 5,
                          }"
                        />
                      </v-label> -->
          </template>
          <template v-for="(item, index) in corridorEnds">
            <v-line
              :key="item.code"
              :config="item"
              @click="corridorEndLabelClick(item)"
            />
            <!-- <v-label
                        :key="item.code + 'label'"
                        :config="{
                          x: item.points[0],
                          y: item.points[1],
                        }"
                        @click="obstacleSettingClick(item)"
                      >
                        <v-text
                          :config="{
                            text: getRoomInfo(item),
                            fill: 'green',
                            padding: 5,
                          }"
                        />
                      </v-label> -->
          </template>
          <template v-for="(item, index) in doors">
            <v-line :key="item.code" :config="item" />
            <v-label
              :key="item.code + 'label'"
              :config="{
                x: item.points[0],
                y: item.points[1],
              }"
              @click="doorLabelClick(item)"
            >
              <v-text
                :config="{
                  text: getLineInfo(item),
                  fill: 'green',
                  padding: 5,
                }"
              />
            </v-label>
          </template>

          <!-- <v-line
                    v-for="(item, index) in exitStairAreas"
                    :key="item.code"
                    :config="item"
                  /> -->

          <template v-for="(item, index) in exitStairAreas">
            <v-line :key="item.code" :config="item" />
            <v-label
              :key="item.code + 'label'"
              :config="{
                x: item.points[0],
                y: item.points[1],
              }"
              @click="exitAreaLabelClick(item)"
            >
              <v-text
                :config="{
                  text: getRoomInfo(item),
                  fill: 'green',
                  padding: 5,
                }"
              />
            </v-label>
          </template>

          <!-- <v-line
                    v-for="(item, index) in exitStairWidths"
                    :key="item.code"
                    :config="item"
                  /> -->
          <template v-for="(item, index) in exitStairWidths">
            <v-line :key="item.code" :config="item" />
            <v-label
              :key="item.code + 'label'"
              :config="{
                x: item.points[0],
                y: item.points[1],
              }"
              @click="exitStairWidthLabelClick(item)"
            >
              <v-text
                :config="{
                  text: getLineInfo(item),
                  fill: 'green',
                  padding: 5,
                }"
              />
            </v-label>
          </template>

          <!-- <v-line
                    v-for="(item, index) in exitStairDoors"
                    :key="item.code"
                    :config="item"
                  /> -->
          <template v-for="(item, index) in exitStairDoors">
            <v-line :key="item.code" :config="item" />
            <v-label
              :key="item.code + 'label'"
              :config="{
                x: item.points[0],
                y: item.points[1],
              }"
              @click="exitDoorSettingClick(item)"
            >
              <v-text
                :config="{
                  text: getLineInfo(item),
                  fill: 'green',
                  padding: 5,
                }"
              /> </v-label
          ></template>

          <!-- <v-line
                    v-for="(item, index) in exitSeperations"
                    :key="item.code"
                    :config="item"
                  /> -->

          <template v-for="(item, index) in exitSeperations">
            <v-line :key="item.code" :config="item" />
            <v-label
              :key="item.code + 'label'"
              :config="{
                x: item.points[0],
                y: item.points[1],
              }"
              @click="exitSeperationLabelClick(item)"
            >
              <v-text
                :config="{
                  text: getLineInfo(item),
                  fill: 'green',
                  padding: 5,
                }"
              />
            </v-label>
          </template>

          <!-- <v-line
                      v-for="(item, index) in roomDiagonalDistances"
                      :key="item.code"
                      :config="item"
                    /> -->

          <template v-for="(item, index) in diagonalDistances">
            <v-line
              :key="item.code"
              :config="item"
              @click="diagonalDistanceLabelClick(item)"
              @mousemove="onMouseMove(item)"
              @mouseout="onMouseOut"
            />
            <!-- <v-label
                      :key="item.code + 'label'"
                      :config="{
                        x: item.points[0],
                        y: item.points[1],
                      }"
                      @click="diagonalDistanceLabelClick(item)"
                    >
                      <v-text
                        :config="{
                          text: getLineInfo(item),
                          fill: 'green',
                          padding: 5,
                        }"
                      />
                    </v-label> -->
          </template>

          <!-- <v-line
                    v-for="(item, index) in travelDistances"
                    :key="item.code"
                    :config="item"
                  /> -->
          <template v-for="(item, index) in travelDistances">
            <v-arrow
              :key="item.code"
              :config="item"
              @click="travelDistanceLabelClick(item)"
              @mousemove="onMouseMoveTravelDistance(item)"
              @mouseout="onMouseOut"
            />
            <v-label
              :key="item.code + 'label'"
              :config="{
                x: getMiddlePoint(item.points).x,
                y: getMiddlePoint(item.points).y,
              }"
              @click="travelDistanceLabelClick(item)"
            >
              <v-text
                :config="{
                  text: getLineInfo(item),
                  fill: 'black',
                  padding: 5,
                }"
              />
            </v-label>
          </template>

          <!-- <v-line
                    v-for="(item, index) in commonPaths"
                    :key="item.code"
                    :config="item"
                  /> -->
          <template v-for="(item, index) in commonPaths">
            <v-arrow
              :key="item.code"
              :config="item"
              @mousemove="onMouseMoveTravelDistance(item)"
              @mouseout="onMouseOut"
            />
            <v-label
              :key="item.code + 'label'"
              :config="{
                x: getMiddlePoint(item.points).x,
                y: getMiddlePoint(item.points).y,
              }"
              @click="commonPathLabelClick(item)"
            >
              <v-text
                :config="{
                  text: getLineInfo(item),
                  fill: 'black',
                  padding: 5,
                }"
              />
            </v-label>
          </template>

          <template v-for="(item, index) in deadEnds">
            <v-arrow
              :key="item.code"
              :config="item"
              @mousemove="onMouseMoveTravelDistance(item)"
              @mouseout="onMouseOut"
            />
            <v-label
              :key="item.code + 'label'"
              :config="{
                x: getMiddlePoint(item.points).x,
                y: getMiddlePoint(item.points).y,
              }"
              @click="commonPathLabelClick(item)"
            >
              <v-text
                :config="{
                  text: getLineInfo(item),
                  fill: 'black',
                  padding: 5,
                }"
              />
            </v-label>
          </template>
        </v-layer>
        <v-layer ref="toolTipLayer">
          <v-text
            ref="toolTip"
            :config="{
              x: this.toolTip.x,
              y: this.toolTip.y,
              text: this.toolTip.text,
              fontFamily: 'Calibri',
              fontSize: 12,
              padding: 5,
              textFill: 'white',
              fill: 'black',
              alpha: 0.75,
              visible: this.toolTip.visible,
            }"
          />
        </v-layer>
        <div>
          <v-layer ref="pathFinderLayer">
            <div v-if="showTravelDistancePage">
              <v-circle
                v-for="item in walls"
                :key="item.id"
                :config="{
                  id: item.id,
                  x: item.x,
                  y: item.y,
                  radius: 2,
                  fill: 'white',
                  stroke: item.stroke,
                  draggable: true,
                }"
              />
              <template v-for="rows in grid">
                <v-rect
                  v-for="item in rows"
                  :key="item.code"
                  :config="item"
                  @click="gridClick(item)"
                />
              </template>

              <v-circle
                v-for="item in roomStartPosition"
                :key="item.id"
                :config="{
                  id: item.id,
                  x: item.x,
                  y: item.y,
                  radius: 2,
                  fill: 'green',
                  stroke: item.stroke,
                  draggable: true,
                }"
              />

              <v-circle
                v-for="item in deadEndStartPosition"
                :key="item.id"
                :config="{
                  id: item.id,
                  x: item.x,
                  y: item.y,
                  radius: 2,
                  fill: 'blue',
                  stroke: 'blue',
                  draggable: false,
                }"
              />
            </div>
          </v-layer>
        </div>
      </v-stage>
    </div>
    <div>
      <CModal
        title="Scale Setting"
        :show.sync="scaleSettingPopup"
        size="sm"
        @update:show="onScaleSettingConfirmation"
      >
        <CRow>
          <CCol sm="12">
            <CForm>
              <CInput label="Scale" horizontal v-model="newScale" />
            </CForm>
          </CCol>
        </CRow>
      </CModal>
    </div>
    <div>
      <CModal title="Room Setting" :show.sync="roomSettingPopup" size="lg">
        <CRow>
          <CCol sm="12">
            <CForm>
              <!-- <CInput label="Id" v-model="obj.id" horizontal plaintext /> -->
              <CInput
                label="Code"
                horizontal
                v-model="roomSettingObj.code"
                readonly
              />
              <CInput label="Name" horizontal v-model="roomSettingObj.name" />
              <CInput
                label="Occupancy Classification"
                horizontal
                readonly
                :value="
                  getOccupantLoadFactorForDisplay(selectedOccupantLoadFactor)
                "
              >
                <template #append>
                  <CButton
                    color="primary"
                    @click="onSearchOccupantLoadFactor()"
                  >
                    Search
                  </CButton>
                </template>
              </CInput>

              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label"> Doors </CCol>
                <CCol sm="9">
                  <CDataTable
                    :items="computedRoomDoorList"
                    :fields="roomDoorFieldList"
                    striped
                    caption="Striped Table"
                    :loading="loading"
                  >
                    <template #show_remove="{ item }">
                      <td class="py-2">
                        <CButton
                          color="primary"
                          variant="outline"
                          square
                          size="sm"
                          @click="onRemoveRoomDoor(item)"
                        >
                          Remove
                        </CButton>
                      </td>
                    </template>
                  </CDataTable>
                  <CButton
                    size="sm"
                    color="primary"
                    class="ml-1"
                    @click="onAddRoomDoor()"
                  >
                    Add Door
                  </CButton>
                </CCol>
              </CRow>

              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label">
                  Exit Speration
                </CCol>
                <CCol sm="9">
                  <CDataTable
                    :items="computedRoomExitSeperationList"
                    :fields="roomExitSeperationFieldList"
                    striped
                    caption="Striped Table"
                    :loading="loading"
                  >
                  </CDataTable>
                </CCol>
              </CRow>
              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label">
                  Diagonal
                </CCol>
                <CCol sm="9">
                  <CDataTable
                    :items="computedRoomDiagonalList"
                    :fields="roomDiagonalFieldList"
                    striped
                    caption="Striped Table"
                    :loading="loading"
                  >
                  </CDataTable>
                </CCol>
              </CRow>
            </CForm>
          </CCol>
        </CRow>
        <div slot="footer" class="w-100">
          <CButton
            class="ml-1 mr-1 float-right"
            color="primary"
            @click="onRoomSettingConfirmation"
          >
            OK
          </CButton>
          <CButton
            class="ml-1 mr-1 float-right"
            color="danger"
            @click="onRoomSettingDelete"
          >
            Delete
          </CButton>
          <CButton
            class="ml-1 mr-1 float-right"
            color="secondary"
            @click="roomSettingPopup = false"
          >
            Cancel
          </CButton>
        </div>
      </CModal>
    </div>

    <div>
      <CModal
        title="Obstacle/Wall Setting"
        :show.sync="obstacleSettingPopup"
        size="sm"
      >
        <CRow>
          <CCol sm="12">
            <CForm>
              <CInput
                label="Code"
                horizontal
                v-model="obstacleSettingObj.code"
                readonly
              />
            </CForm>
          </CCol>
        </CRow>
        <div slot="footer" class="w-100">
          <CButton
            class="ml-1 mr-1 float-right"
            color="primary"
            @click="onObstacleSettingConfirmation"
          >
            OK
          </CButton>
          <CButton
            class="ml-1 mr-1 float-right"
            color="danger"
            @click="onObstacleSettingDelete"
          >
            Delete
          </CButton>
          <CButton
            class="ml-1 mr-1 float-right"
            color="secondary"
            @click="obstacleSettingPopup = false"
          >
            Cancel
          </CButton>
        </div>
      </CModal>
    </div>

    <div>
      <CModal :show.sync="occupantLoadFactorSearchPopup" size="lg">
        <template #header>
          <h6 class="modal-title">Select Occupant Load Factor</h6>
        </template>
        <template #footer>
          <CButton
            @click="occupantLoadFactorSearchPopup = false"
            color="secondary"
            >Close</CButton
          >
          <CButton @click="addNewOccupantLoadFactor()" color="primary"
            >Add New</CButton
          >
        </template>

        <CRow>
          <CCol sm="12">
            <CDataTable
              :items="computedOccupantLoadFactorList"
              :fields="occupantLoadFactorFieldList"
              column-filter
              items-per-page-select
              :items-per-page="5"
              hover
              sorter
              pagination
              :loading="loading"
            >
              <template #show_details="{ item, index }">
                <td class="py-2">
                  <CButton
                    color="primary"
                    variant="outline"
                    square
                    size="sm"
                    @click="onOccupantLoadFactorSelected(item, index)"
                  >
                    Select
                  </CButton>
                </td>
              </template>
            </CDataTable>
          </CCol>
        </CRow>
      </CModal>
    </div>

    <div>
      <CModal :show.sync="addNewOccupantLoadFactorPopup" size="lg">
        <template #header>
          <h6 class="modal-title">New Occupant Load Factor</h6>
        </template>
        <template #footer>
          <CButton
            @click="onNewOccupantLoadFactorConfirmation()"
            color="primary"
            >OK</CButton
          >
          <CButton
            @click="addNewOccupantLoadFactorPopup = false"
            color="secondary"
            >Cancel</CButton
          >
        </template>

        <CRow>
          <CCol sm="12">
            <CForm>
              <CInput
                label="Building Code"
                horizontal
                readonly
                v-model="selectedBuildingCode.name"
              >
                <template #append>
                  <CButton color="primary" @click="onSearchBuildingCode()">
                    Search
                  </CButton>
                </template>
              </CInput>
              <CInput
                label="Main Category"
                horizontal
                readonly
                v-model="selectedMainCategory.name"
              >
                <template #append>
                  <CButton color="primary" @click="onSearchMainCategory()">
                    Search
                  </CButton>
                </template>
              </CInput>

              <CInput
                label="Sub Category"
                horizontal
                readonly
                v-model="selectedSubCategory.name"
              >
                <template #append>
                  <CButton color="primary" @click="onSearchSubCategory()">
                    Search
                  </CButton>
                </template>
              </CInput>

              <CInput
                label="Value"
                horizontal
                v-model="newOccupantLoadFactorObj.olfValue"
              />
            </CForm>
          </CCol>
        </CRow>
      </CModal>
    </div>

    <div>
      <CModal :show.sync="mainCategorySearchPopup" size="xl">
        <template #header>
          <h6 class="modal-title">Select Main Category</h6>
        </template>
        <template #footer>
          <CButton @click="mainCategorySearchPopup = false" color="secondary"
            >Close</CButton
          >
          <CButton @click="addNewMainCategory()" color="primary"
            >Add New</CButton
          >
          <!-- <CButton @click="darkModal = false" color="success">Accept</CButton> -->
        </template>

        <CRow>
          <CCol sm="12">
            <CDataTable
              :items="mainCategoryList"
              :fields="mainCategoryFieldList"
              column-filter
              items-per-page-select
              :items-per-page="10"
              hover
              sorter
              pagination
              :loading="loading"
            >
              <template #show_details="{ item, index }">
                <td class="py-2">
                  <CButton
                    color="primary"
                    variant="outline"
                    square
                    @click="onMainCategorySelected(item, index)"
                  >
                    Select
                  </CButton>
                </td>
              </template>
            </CDataTable>
          </CCol>
        </CRow>
      </CModal>
    </div>

    <div>
      <CModal :show.sync="subCategorySearchPopup" size="xl">
        <template #header>
          <h6 class="modal-title">Select Sub Category</h6>
        </template>
        <template #footer>
          <CButton @click="subCategorySearchPopup = false" color="secondary"
            >Close</CButton
          >
          <CButton @click="addNewSubCategory()" color="primary"
            >Add New</CButton
          >
          <!-- <CButton @click="darkModal = false" color="success">Accept</CButton> -->
        </template>

        <CRow>
          <CCol sm="12">
            <CDataTable
              :items="subCategoryList"
              :fields="subCategoryFieldList"
              column-filter
              items-per-page-select
              :items-per-page="10"
              hover
              sorter
              pagination
              :loading="loading"
            >
              <template #show_details="{ item, index }">
                <td class="py-2">
                  <CButton
                    color="primary"
                    variant="outline"
                    square
                    @click="onSubCategorySelected(item, index)"
                  >
                    Select
                  </CButton>
                </td>
              </template>
            </CDataTable>
          </CCol>
        </CRow>
      </CModal>
    </div>

    <div>
      <CModal :show.sync="buildingCodeSearchPopup" size="xl">
        <template #header>
          <h6 class="modal-title">Select Building Code</h6>
          <!-- <CButtonClose @click="darkModal = false" class="text-white" /> -->
        </template>
        <template #footer>
          <CButton @click="buildingCodeSearchPopup = false" color="secondary"
            >Close</CButton
          >
          <CButton @click="addNewBuildingCode()" color="primary"
            >Add New</CButton
          >
          <!-- <CButton @click="darkModal = false" color="success">Accept</CButton> -->
        </template>

        <CRow>
          <CCol sm="12">
            <CDataTable
              :items="buildingCodeList"
              :fields="buildingCodeFieldList"
              column-filter
              items-per-page-select
              :items-per-page="10"
              hover
              sorter
              pagination
              :loading="loading"
            >
              <template #show_details="{ item, index }">
                <td class="py-2">
                  <CButton
                    color="primary"
                    variant="outline"
                    square
                    @click="onBuildingCodeSelected(item, index)"
                  >
                    Select
                  </CButton>
                </td>
              </template>
            </CDataTable>
          </CCol>
        </CRow>
      </CModal>
    </div>

    <div>
      <CModal
        title="Add New Building Code"
        :show.sync="addNewBuildingCodePopup"
      >
        <CForm>
          <CInput label="Code" horizontal v-model="newBuildingCodeObj.code" />
          <CInput label="Name" horizontal v-model="newBuildingCodeObj.name" />
          <CInput
            label="Description"
            horizontal
            v-model="newBuildingCodeObj.description"
          />
        </CForm>
        <div slot="footer" class="w-100">
          <CButton
            class="ml-1 mr-1 float-right"
            color="primary"
            @click="onNewBuildingCodeConfirmation"
          >
            OK
          </CButton>
          <CButton
            class="ml-1 mr-1 float-right"
            color="secondary"
            @click="addNewBuildingCodePopup = false"
          >
            Cancel
          </CButton>
        </div>
      </CModal>
    </div>

    <div>
      <CModal
        title="Add New Main Category"
        :show.sync="addNewMainCategoryPopup"
      >
        <CForm>
          <CInput label="Code" horizontal v-model="newMainCategoryObj.code" />
          <CInput label="Name" horizontal v-model="newMainCategoryObj.name" />
          <CInput
            label="Description"
            horizontal
            v-model="newMainCategoryObj.description"
          />
        </CForm>
        <div slot="footer" class="w-100">
          <CButton
            class="ml-1 mr-1 float-right"
            color="primary"
            @click="onNewMainCategoryConfirmation"
          >
            OK
          </CButton>
          <CButton
            class="ml-1 mr-1 float-right"
            color="secondary"
            @click="addNewMainCategoryPopup = false"
          >
            Cancel
          </CButton>
        </div>
      </CModal>
    </div>

    <div>
      <CModal title="Add New Sub Category" :show.sync="addNewSubCategoryPopup">
        <CForm>
          <CInput label="Code" horizontal v-model="newSubCategoryObj.code" />
          <CInput label="Name" horizontal v-model="newSubCategoryObj.name" />
          <CInput
            label="Description"
            horizontal
            v-model="newSubCategoryObj.description"
          />
        </CForm>
        <div slot="footer" class="w-100">
          <CButton
            class="ml-1 mr-1 float-right"
            color="primary"
            @click="onNewSubCategoryConfirmation"
          >
            OK
          </CButton>
          <CButton
            class="ml-1 mr-1 float-right"
            color="secondary"
            @click="addNewSubCategoryPopup = false"
          >
            Cancel
          </CButton>
        </div>
      </CModal>
    </div>

    <div>
      <CModal
        title="Search Doors"
        :show.sync="roomDoorSearchPopup"
        size="lg"
        @update:show="onDoorConfirmation"
        :backdrop="true"
      >
        <CDataTable
          :items="computedDoorList"
          :fields="doorFieldList"
          column-filter
          :items-per-page="5"
          border
          hover
          sorter
          pagination
          :loading="loading"
          clickable-rows
          @row-clicked="doorRowClicked"
        >
          <template #select="{ item }">
            <td>
              <CInputCheckbox
                :checked="item._selected"
                @update:checked="() => selectDoor(item)"
                custom
              />
            </td>
          </template>
        </CDataTable>
      </CModal>
    </div>
  </div>
</template>

<script>
import ContextMenu from "./ContextMenu.vue";
import WpQuickTool from "./WpQuickTool.vue";
import WpZoom from "./WpZoom.vue";

import WpBottomLeft from "@/components/WpBottomLeft.vue";
import WpBottomMid from "@/components/WpBottomMid.vue";
import WpMenuLeft from "@/components/WpMenuLeft.vue";
import WpTopRight from "@/components/WpTopRight.vue";
import DrawingInfo from "@/components/DrawingInfo.vue";
import WorkComponents from "./WorkComponents";

import FloorPlanApi from "@/lib/floorPlanApi";
import OlfMainCategoryApi from "@/lib/olfMainCategoryApi";
import OccupantLoadFactorApi from "@/lib/occupantLoadFactorApi";
import BuildingCodeApi from "@/lib/buildingCodeApi";
import OlfSubCategoryApi from "@/lib/olfSubCategoryApi";
import DeepFloorPlanApi from "@/lib/deepFloorPlanApi";
import PathGenerator from "@/lib/pathGenerator";

import RoomApi from "@/lib/roomApi";
import DoorApi from "@/lib/doorApi";
import ObstacleApi from "@/lib/obstacleApi";

const roomDoorList = [];
const roomDoorFieldList = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "doorType",
    label: "Type",
  },
  {
    key: "show_remove",
    label: "",
    sorter: false,
    filter: false,
  },
];

const doorList = [];
const doorFieldList = [
  {
    key: "select",
    label: "Select",
    _style: "min-width:1%",
    sorter: false,
    filter: false,
  },
  { key: "name" },
  { key: "doorType" },
];

const roomExitSeperationFieldList = [
  {
    key: "doorName",
    label: "From",
  },
  {
    key: "doorName2",
    label: "To",
  },
  {
    key: "distance",
    label: "Distance",
  },
];

const roomDiagonalFieldList = [
  {
    key: "point1",
    label: "Point 1",
  },
  {
    key: "point2",
    label: "Point 2",
  },
  {
    key: "distance",
    label: "Distance",
  },
];
const occupantLoadFactorList = [];
const occupantLoadFactorFieldList = [
  { key: "buildingCodeName" },
  { key: "mainCategoryName" },
  { key: "subCategoryName" },
  { key: "olfValue" },
  {
    key: "show_details",
    label: "",
    _style: "width:1%",
    sorter: false,
    filter: false,
  },
];

const subCategoryList = [];
const subCategoryFieldList = [
  // { key: "id", _style: "min-width:50px" },
  { key: "code", _style: "min-width:200px;" },
  { key: "name", _style: "min-width:200px;" },
  {
    key: "show_details",
    label: "",
    _style: "width:1%",
    sorter: false,
    filter: false,
  },
];

const mainCategoryList = [];
const mainCategoryFieldList = [
  // { key: "id", _style: "min-width:50px" },
  { key: "code", _style: "min-width:200px;" },
  { key: "name", _style: "min-width:200px;" },
  {
    key: "show_details",
    label: "",
    _style: "width:1%",
    sorter: false,
    filter: false,
  },
];

const buildingCodeList = [];
const buildingCodeFieldList = [
  // { key: "id", _style: "min-width:50px" },
  { key: "code", _style: "min-width:200px;" },
  { key: "name", _style: "min-width:200px;" },
  {
    key: "show_details",
    label: "",
    _style: "width:1%",
    sorter: false,
    filter: false,
  },
];

export default {
  name: "WpBoard",
  components: {
    ContextMenu,
    WpQuickTool,
    WpZoom,
    WpMenuLeft,
    WpBottomLeft,
    WpTopRight,
    DrawingInfo,
    WpBottomMid,
    WorkComponents,
  },
  props: {
    obj: null,
    drawingMeta: null,
  },
  data() {
    return {
      showComponent: false,
      cellsProcessed: [],
      path: [],
      walls: [],
      showTravelDistancePage: true,
      startPosList: [],
      endPosList: [],
      map: null,
      cellSize: 10,
      grid: [],
      roomStartPosition: [],
      deadEndStartPosition: [],
      detectDoors: [],
      pathDrawingType: "",

      roomDoorSearchPopup: false,
      roomDoorList: roomDoorList.map((item, index) => {
        return { ...item, index };
      }),
      roomDoorFieldList,

      loadingDeepFloorPlane: false,
      infoList: [],
      step: 0,
      newOccupantLoadFactorObj: {},
      buildingCodeList: buildingCodeList.map((item, id) => {
        return { ...item, id };
      }),
      buildingCodeFieldList,

      mainCategoryList: mainCategoryList.map((item, id) => {
        return { ...item, id };
      }),
      mainCategoryFieldList,

      subCategoryList: subCategoryList.map((item, id) => {
        return { ...item, id };
      }),
      subCategoryFieldList,
      buildingCodeSearchPopup: false,
      addNewBuildingCodePopup: false,
      mainCategorySearchPopup: false,
      addNewMainCategoryPopup: false,
      subCategorySearchPopup: false,
      addNewSubCategoryPopup: false,

      newBuildingCodeObj: {
        code: "",
        name: "",
        description: "",
      },
      newMainCategoryObj: {
        code: "",
        name: "",
        description: "",
      },
      newSubCategoryObj: {
        code: "",
        name: "",
        description: "",
      },
      addNewOccupantLoadFactorPopup: false,
      selectedSubCategory: {
        id: null,
        name: "",
        code: "",
      },
      selectedMainCategory: {
        id: null,
        name: "",
        code: "",
      },
      selectedBuildingCode: {
        id: null,
        name: "",
        code: "",
      },
      api: new FloorPlanApi(),
      olfMainCategoryApi: new OlfMainCategoryApi(),
      occupantLoadFactorApi: new OccupantLoadFactorApi(),
      buildingCodeApi: new BuildingCodeApi(),
      olfSubCategoryApi: new OlfSubCategoryApi(),
      deepFloorPlanApi: new DeepFloorPlanApi(),
      obstacleApi: new ObstacleApi(),
      doorApi: new DoorApi(),
      roomApi: new RoomApi(),

      occupantLoadFactorList: occupantLoadFactorList.map((item, id) => {
        return { ...item, id };
      }),

      roomSettingObj: {},
      roomSettingPopup: false,

      obstacleSettingObj: {},
      obstacleSettingPopup: false,

      loading: false,
      roomExitSeperationFieldList,
      occupantLoadFactorFieldList,
      occupantLoadFactorSearchPopup: false,
      scaleSettingPopup: false,
      newScale: 0,
      image: null,
      showContextMenu: false,
      analysisColorCode: [0, 0, 0],
      analysisTemplateList: [],
      analysisMethod: "",
      toolTip: {
        x: 0,
        y: 0,
        text: "",
        visible: false,
      },
      originalStageSize: {
        width: 3000,
        height: 3000,
      },
      stageSize: {
        width: 3000,
        height: 3000,
        draggable: true,
      },
      stroke: "black",
      strokeWidth: 4,
      mouseClickPoint: [],
      selectedOccupantLoadFactor: {
        id: "",
        olfValue: "",
      },
      roomDoorList: roomDoorList.map((item, index) => {
        return { ...item, index };
      }),
      roomDoorFieldList,
      roomDiagonalFieldList,
      doorList: doorList.map((item, id) => {
        return { ...item, id };
      }),
      doorFieldList,
      drawType: "",
      drawingState: "",
      rooms: [],
      doors: [],
      exitStairAreas: [],
      exitStairDoors: [],
      exitStairWidths: [],
      exitSeperations: [],
      commonPaths: [],
      travelDistances: [],
      diagonalDistances: [],
      obstacles: [],
      corridorEnds: [],
      deadEnds: [],

      // roomDiagonalDistances: [],
      //fslRooms: [],
      // anchors: [],
      stageHistory: [
        {
          drawType: "",
          drawingState: "",
          rooms: [],
          doors: [],
          exitStairAreas: [],
          exitStairDoors: [],
          exitStairWidths: [],
          exitSeperations: [],
          commonPaths: [],
          travelDistances: [],
          diagonalDistances: [],
          obstacles: [],
          corridorEnds: [],
          deadEnds: [],
        },
      ],
    };
  },
  computed: {
    computedDoorList() {
      var self = this;
      return self.doorList.map((item) => {
        return {
          ...item,
          _classes: [item._classes, item._selected ? "table-selected" : ""],
        };
      });
    },
    computedOccupantLoadFactorList() {
      return this.occupantLoadFactorList.map((item) => {
        return {
          ...item,
          buildingCodeName: this.getBuildingCodeName(item),
          mainCategoryName: this.getMainCategoryName(item),
          subCategoryName: this.getSubCategoryName(item),
        };
      });
    },
    computedRoomDiagonalList() {
      var self = this;
      if (self.roomSettingObj.points == null) return;

      var diagonalPoints = drawing.getRoomDiagonalPoints(self.roomSettingObj);
      var distanceInPixel = drawing.getDistanceInPixel(
        diagonalPoints[0],
        diagonalPoints[1],
        diagonalPoints[2],
        diagonalPoints[3]
      );
      var distainceInMeter = drawing.convertDistancePixelToMeter(
        distanceInPixel,
        this.obj.scale.distanceInMeterForOnePixel
      );

      return [
        {
          point1: "(" + diagonalPoints[0] + "," + diagonalPoints[1] + ")",
          point2: "(" + diagonalPoints[2] + "," + diagonalPoints[3] + ")",
          distance: distainceInMeter,
        },
      ];
    },
    computedRoomDoorList() {
      var self = this;
      return self.roomDoorList.map((item) => {
        return {
          ...item,
          name: item.door.name,
          doorType: item.door.doorType,
        };
      });
    },

    floorPlanUrl() {
      var fullUrl = "";
      if (this.obj)
        fullUrl =
          apiUrl + "documents/file/" + this.obj.documentId;

      console.log(fullUrl);
      return fullUrl;
    },

    computedRoomExitSeperationList() {
      var self = this;

      var exitDistanceList = [];
      for (let i = 0; i < self.computedRoomDoorList.length; i++) {
        for (let j = 0; j < self.computedRoomDoorList.length; j++) {
          if (i == j) continue;

          var isDuplicate = false;
          for (let k = 0; k < exitDistanceList.length; k++) {
            if (
              exitDistanceList[k].doorId == self.computedRoomDoorList[i].id &&
              exitDistanceList[k].doorId2 == self.computedRoomDoorList[j].id
            ) {
              isDuplicate = true;
            }
            if (
              exitDistanceList[k].doorId2 == self.computedRoomDoorList[i].id &&
              exitDistanceList[k].doorId == self.computedRoomDoorList[j].id
            ) {
              isDuplicate = true;
            }
          }
          if (isDuplicate) continue;

          exitDistanceList.push({
            doorId: self.computedRoomDoorList[i].id,
            doorName: self.computedRoomDoorList[i].name,
            doorId2: self.computedRoomDoorList[j].id,
            doorName2: self.computedRoomDoorList[j].name,
            distance: self.getDistanceFromPixelPointInMeter(
              self.getCenterPosition(self.computedRoomDoorList[i].door),
              self.getCenterPosition(self.computedRoomDoorList[j].door)
            ),
          });
        }
      }

      return exitDistanceList;
    },
  },
  watch: {
    obj(newVal, oldVal) {
      console.log("obj", newVal);
    },
    drawingMeta(newVal, oldVal) {
      console.log("drawingMeta value changed", newVal);
    },

    floorPlanUrl(newVal, oldVal) {
      const image = new window.Image();
      image.src = this.floorPlanUrl;
      image.crossOrigin = "anonymous";
      image.onload = () => {
        this.image = image;

        this.originalStageSize.width = image.width;
        this.originalStageSize.height = image.height;

        this.stageSize.width = this.originalStageSize.width * 2;
        this.stageSize.height = this.originalStageSize.height * 2;

        this.exitSeperations = this.obj.exitSeperations;
        this.exitStairWidths = this.obj.exitStairWidths;
        this.exitStairDoors = this.obj.exitStairDoors;
        this.diagonalDistances = this.obj.diagonalDistances;
        this.travelDistances = this.obj.travelDistances;
        this.commonPaths = this.obj.commonPaths;
        this.rooms = this.obj.rooms;
        this.obstacles = this.obj.obstacles;
        this.doors = this.obj.doors;
        this.exitStairAreas = this.obj.exitStairAreas;
        this.corridorEnds = this.obj.corridorEnds;
        this.deadEnds = this.obj.deadEnds;

        this.autoDrawExitSeperation();
        this.autoDrawDiagonalDistance();
      };
    },
  },
  methods: {
    showComponentList() {
      this.showComponent = !this.showComponent;
    },
    onMouseMoveTravelDistance(item) {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      this.toolTip.x = mousePos.x + 5;
      this.toolTip.y = mousePos.y + 5;
      this.toolTip.text = this.getLineDetailInfo(item);
      this.toolTip.visible = true;
    },
    getLineDetailInfo(item) {
      var code = item.name;
      var area = this.getDistanceInMeter(item);
      return code + "\n" + area + "m";
    },
    getDistanceInMeter(item) {
      var distanceInPixel = this.getDistance(item);
      var distainceInMeter =
        distanceInPixel * this.obj.scale.distanceInMeterForOnePixel;
      distainceInMeter = Math.round(distainceInMeter * 1000) / 1000;

      return distainceInMeter;
    },
    getDistance(item) {
      try {
        // var points = item.points;

        return drawing.getDistanceFromPoints(item.points);
      } catch (error) {}
      return 0;
    },

    showGridUpdateClick() {
      this.showTravelDistancePage = this.drawingMeta.showGrid;
      this.cellSize = parseInt(this.drawingMeta.gridSize);
      this.cellsProcessed = [];
      this.path = [];
      this.walls = [];
      this.startPosList = [];
      this.endPosList = [];
      // this.travelDistances = [];
      this.prepareGrid(true);
    },
    travelDistanceClearClick() {
      this.travelDistances = [];
      this.commonPaths = [];
      this.deadEnds = [];
      this.showTravelDistancePage = this.drawingMeta.showGrid;
      this.cellSize = parseInt(this.drawingMeta.gridSize);
    },
    gridSizeUpdateClick() {
      this.showTravelDistancePage = this.drawingMeta.showGrid;
      this.cellSize = parseInt(this.drawingMeta.gridSize);
      this.cellsProcessed = [];
      this.path = [];
      this.walls = [];
      this.startPosList = [];
      this.endPosList = [];
      this.prepareGrid(true);
    },
    getOccupantLoadFactorForDisplay(item) {
      if (item == null) return "N/A";
      if (item.olfMainCategory == null) return "N/A";
      if (item.olfSubCategory == null) return "N/A";
      return (
        item.olfMainCategory.name +
        " - " +
        item.olfSubCategory.name +
        " (" +
        item.olfValue +
        ")"
      );
    },
    getDistanceFromPixelPointInMeter(line1, line2) {
      // return "(" + line1.x + "," + line1.y + ")" + "(" + line2.x + "," + line2.y + ")";
      var distanceInPixel = drawing.getDistanceInPixel(
        line1.x,
        line1.y,
        line2.x,
        line2.y
      );
      var distainceInMeter = drawing.convertDistancePixelToMeter(
        distanceInPixel,
        this.obj.scale.distanceInMeterForOnePixel
      );

      return distainceInMeter;
    },
    getCenterPositionForDisplay(obj) {
      var center = this.getCenterPosition(obj);
      if (center == null) return "";
      return "(" + center.x + "," + center.y + ")";
    },
    getCenterPosition(obj) {
      if (obj.points == null) return null;
      if (obj.points.length < 4) return null;

      var minX = -1;
      var minY = -1;
      var maxX = -1;
      var maxY = -1;

      for (let j = 0; j < obj.points.length; j = j + 2) {
        var positionX = obj.points[j];
        var positionY = obj.points[j + 1];
        if (minX < 0) minX = positionX;
        if (positionX < minX) minX = positionX;

        if (maxX < 0) maxX = positionX;
        if (positionX > maxX) maxX = positionX;

        if (minY < 0) minY = positionY;
        if (positionY < minY) minY = positionY;

        if (maxY < 0) maxY = positionY;
        if (positionY > maxY) maxY = positionY;
      }
      return {
        x: Math.round((minX + maxX) / 2),
        y: Math.round((minY + maxY) / 2),
      };
    },

    onDoorConfirmation(status, evt, accept) {
      var self = this;
      if (accept) {
        var tempList = [];
        for (let i = 0; i <= self.doorList.length; i++) {
          try {
            if (
              self.doorList[i]._selected !== undefined &&
              self.doorList[i]._selected == true
            ) {
              tempList.push({
                doorId: self.doorList[i].id,
                door: self.doorList[i],
              });
              // tempList.push(self.locationList[i]);
            }
          } catch (err) {}
        }
        self.roomDoorList = tempList;
      }
    },
    doorRowClicked(item, index, column, e) {
      if (!["INPUT", "LABEL"].includes(e.target.tagName)) {
        // alert(item);
        this.selectDoor(item);
      }
    },
    selectDoor(item) {
      var self = this;
      for (let i = 0; i <= self.doorList.length; i++) {
        try {
          if (self.doorList[i].id == item.id) {
            const val = Boolean(self.doorList[i]._selected);
            self.$set(self.doorList[i], "_selected", !val);
          }
        } catch (err) {}
      }
    },
    getLongestPositionByGrid(currentRoom) {
      var minX = -1;
      var minY = -1;
      var maxX = -1;
      var maxY = -1;

      for (let j = 0; j < currentRoom.points.length; j = j + 2) {
        var positionX = currentRoom.points[j];
        var positionY = currentRoom.points[j + 1];

        if (minX == -1) {
          minX = positionX;
          maxX = positionX;
          minY = positionY;
          maxY = positionY;
          continue;
        }

        if (positionX < minX) minX = positionX;
        if (positionX > maxX) maxX = positionX;

        if (positionY < minY) minY = positionY;
        if (positionY > maxY) maxY > positionY;
      }
      for(let i = minX; i < maxX ; i+=this.cellSize){
        for(let j = minY; j < maxY ; j+=this.cellSize){

        }
      }


      var longestDistance = 0;
      var longestPosition = null;
      for (let i = 0; i < currentRoom.roomDoors.length; i++) {
        var currentDoor = currentRoom.roomDoors[i].door;
        var centerDoorX = (currentDoor.points[0] + currentDoor.points[2]) / 2;
        var centerDoorY = (currentDoor.points[1] + currentDoor.points[3]) / 2;

        centerDoorX = Math.round(centerDoorX);
        centerDoorY = Math.round(centerDoorY);

        for (let j = 0; j < currentRoom.points.length; j = j + 2) {
          var positionX = currentRoom.points[j];
          var positionY = currentRoom.points[j + 1];

          var distanceInPixel = drawing.getDistanceInPixel(
            centerDoorX,
            centerDoorY,
            positionX,
            positionY
          );

          if (distanceInPixel > longestDistance) {
            longestDistance = distanceInPixel;
            var newPositionX = positionX;
            var newPositionY = positionY;

            if (centerDoorX > newPositionX)
              newPositionX = newPositionX + this.cellSize;
            else newPositionX = newPositionX - this.cellSize;

            if (centerDoorY > newPositionY)
              newPositionY = newPositionY + this.cellSize;
            else newPositionY = newPositionY - this.cellSize;

            longestPosition = {
              x: newPositionX,
              y: newPositionY,
            };
          }
        }
      }
      return longestPosition;
    },

    getLongestPosition(currentRoom) {
      var longestDistance = 0;
      var longestPosition = null;
      for (let i = 0; i < currentRoom.roomDoors.length; i++) {
        var currentDoor = currentRoom.roomDoors[i].door;
        var centerDoorX = (currentDoor.points[0] + currentDoor.points[2]) / 2;
        var centerDoorY = (currentDoor.points[1] + currentDoor.points[3]) / 2;

        centerDoorX = Math.round(centerDoorX);
        centerDoorY = Math.round(centerDoorY);

        for (let j = 0; j < currentRoom.points.length; j = j + 2) {
          var positionX = currentRoom.points[j];
          var positionY = currentRoom.points[j + 1];

          var distanceInPixel = drawing.getDistanceInPixel(
            centerDoorX,
            centerDoorY,
            positionX,
            positionY
          );

          if (distanceInPixel > longestDistance) {
            longestDistance = distanceInPixel;
            var newPositionX = positionX;
            var newPositionY = positionY;

            if (centerDoorX > newPositionX)
              newPositionX = newPositionX + this.cellSize;
            else newPositionX = newPositionX - this.cellSize;

            if (centerDoorY > newPositionY)
              newPositionY = newPositionY + this.cellSize;
            else newPositionY = newPositionY - this.cellSize;

            longestPosition = {
              x: newPositionX,
              y: newPositionY,
            };
          }
        }
      }
      return longestPosition;
    },
    resetObj() {
      var self = this;
      if (self.obj.id) {
        self.api
          .get(self.$route.params.id)
          .then((response) => {
            self.obj = response.result;
            console.log("self.obj", self.obj);
            if (
              self.obj.scale == null ||
              self.obj.scale.distanceInMeterForOnePixel == 0
            )
              self.toast(
                "Warning",
                "Please check your scale setting",
                "warning"
              );
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }
    },

    onRemoveRoomDoor(item) {
      helper.removeObjFromArray(this.roomSettingObj.roomDoors, item);
      this.refreshTableDoor();
    },
    onAddRoomDoor() {
      var self = this;
      self.refreshTableDoor();
      self.roomDoorSearchPopup = true;
    },
    onRoomDoorSelected(item, index) {
      var self = this;
      var selectedDoor = item;

      self.roomDoorSearchPopup = true;
    },

    refreshTableDoor() {
      var self = this;
      self.doorApi
        .getListByFloorPlanId(self.obj.id)
        .then((response) => {
          self.doorList = response.result;

          for (let i = 0; i < self.roomDoorList.length; i++) {
            for (let j = 0; j < self.doorList.length; j++)
              if (self.roomDoorList[i].doorId == self.doorList[j].id) {
                self.$set(self.doorList[i], "_selected", true);
              }
          }
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
          // console.log(data);
        });
    },
    zoomReset() {
      var stage = this.$refs.stage.getStage();
      stage.scale({ x: 0.8, y: 0.8 });
    },
    zoomIn() {
      this.scaleBy(0.1);
    },
    zoomOut() {
      this.scaleBy(-0.1);
    },
    scaleBy(scale) {
      var stage = this.$refs.stage.getStage();
      var oldScale = stage.scaleX();
      var newScale = oldScale + scale; // oldScale + scale;
      stage.scale({ x: newScale, y: newScale });
      console.log("stage", stage);
    },
    toast(header, message, color) {
      var self = this;
      self.infoList.push({
        header: header,
        message: message,
        color: color,
      });
    },

    getAnchors(item) {
      var anchors = [];
      var room = item;
      for (let i = 0; i < room.points.length; i += 2) {
        var anchorCode = room.code + "_points_" + i;
        anchors.push({
          roomId: room.id,
          roomCode: room.code,
          code: anchorCode,
          pointFirstIndex: i,
          x: room.points[i],
          y: room.points[i + 1],
        });
      }
      return anchors;
    },

    updatePoly(event) {
      const mousePos = this.$refs.stage.getNode().getPointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      const roomId = event.target.attrs.roomId;
      const pointFirstIndex = event.target.attrs.pointFirstIndex;
      const room = this.rooms.find((i) => i.id === roomId);

      room.points[pointFirstIndex] = x;
      room.points[pointFirstIndex + 1] = y;
    },

    // handleClickOnPolygonNode(event) {
    //   // const id = event.target.id();
    //   // const item = this.computedRoomsAnchor.find((i) => i.id === id);
    //   // const index = this.computedRoomsAnchor.indexOf(item);
    //   // if (index === 0) {
    //   //   this.closed = true;
    //   //   this.isPolygonFinished = true;
    //   //   this.anchors[this.anchors.length - 1].stroke = "black";
    //   // }
    // },
    getLineInfo(item) {
      return item.name;
    },
    onNewOccupantLoadFactorConfirmation() {
      var self = this;
      self.newOccupantLoadFactorObj.buildingCodeId =
        self.selectedBuildingCode.id.toString();
      self.newOccupantLoadFactorObj.olfMainCategoryId =
        self.selectedMainCategory.id.toString();
      self.newOccupantLoadFactorObj.olfSubCategoryId =
        self.selectedSubCategory.id.toString();

      if (!self.newOccupantLoadFactorObj.id) {
        this.occupantLoadFactorApi
          .create(self.newOccupantLoadFactorObj)
          .then((response) => {
            //self.$router.push({ path: "/tenant/occupantLoadFactorList" });
            // self.toast("Success", "Added", "success");
            self.addNewOccupantLoadFactorPopup = false;
            self.refreshTableOccupantLoadFactor();
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
          });
      } else {
        this.occupantLoadFactorApi
          .update(self.newOccupantLoadFactorObj)
          .then((response) => {
            //self.$router.push({ path: "/tenant/occupantLoadFactorList" });
            self.addNewOccupantLoadFactorPopup = false;
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
          });
      }
    },
    addNewMainCategory() {
      this.newMainCategoryObj.code = "";
      this.newMainCategoryObj.name = "";
      this.newMainCategoryObj.description = "";

      this.addNewMainCategoryPopup = true;
    },
    addNewSubCategory() {
      this.newSubCategoryObj.code = "";
      this.newSubCategoryObj.name = "";
      this.newSubCategoryObj.description = "";

      this.addNewSubCategoryPopup = true;
    },
    addNewBuildingCode() {
      this.newBuildingCodeObj.code = "";
      this.newBuildingCodeObj.name = "";
      this.newBuildingCodeObj.description = "";

      this.addNewBuildingCodePopup = true;
    },

    onNewMainCategoryConfirmation() {
      this.onSubmitMainCategory();
      this.addNewMainCategoryPopup = false;
    },

    onSubmitMainCategory() {
      var self = this;
      if (!self.newMainCategoryObj.id) {
        this.olfMainCategoryApi
          .create(self.newMainCategoryObj)
          .then((response) => {
            self.refreshTableMainCategory();
            // self.$router.push({ path: "/tenant/buildingRuleList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
          });
      } else {
        this.api
          .update(self.newMainCategoryObj)
          .then((response) => {
            self.refreshTableMainCategory();

            // self.$router.push({ path: "/tenant/buildingRuleList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
          });
      }
    },

    onNewSubCategoryConfirmation() {
      this.onSubmitSubCategory();
      this.addNewSubCategoryPopup = false;
    },

    onSubmitSubCategory() {
      var self = this;
      if (!self.newSubCategoryObj.id) {
        this.olfSubCategoryApi
          .create(self.newSubCategoryObj)
          .then((response) => {
            self.refreshTableSubCategory();
            // self.$router.push({ path: "/tenant/buildingRuleList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
          });
      } else {
        this.api
          .update(self.newSubCategoryObj)
          .then((response) => {
            self.refreshTableSubCategory();

            // self.$router.push({ path: "/tenant/buildingRuleList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
          });
      }
    },

    onNewBuildingCodeConfirmation() {
      this.onSubmitBuildingCode();
      this.addNewBuildingCodePopup = false;
    },

    onSubmitBuildingCode() {
      var self = this;
      if (!self.newBuildingCodeObj.id) {
        this.buildingCodeApi
          .create(self.newBuildingCodeObj)
          .then((response) => {
            self.refreshTableBuildingCode();
            // self.$router.push({ path: "/tenant/buildingRuleList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
          });
      } else {
        this.api
          .update(self.newBuildingCodeObj)
          .then((response) => {
            self.refreshTableBuildingCode();

            // self.$router.push({ path: "/tenant/buildingRuleList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
          });
      }
    },
    onSearchBuildingCode() {
      var self = this;
      self.refreshTableBuildingCode();
      self.buildingCodeSearchPopup = true;
    },
    onBuildingCodeSelected(item, index) {
      var self = this;
      self.selectedBuildingCode = item;
      self.obj.buildingCodeId = item.id.toString();
      self.buildingCodeSearchPopup = false;
    },
    refreshTableBuildingCode() {
      var self = this;
      self.loading = true;
      self.buildingCodeList = [];
      self.buildingCodeApi
        .getList()
        .then((response) => {
          self.buildingCodeList = response.result;
          self.loading = false;
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
          // console.log(data);
        });
    },

    onSearchMainCategory() {
      var self = this;
      self.refreshTableMainCategory();
      self.mainCategorySearchPopup = true;
    },
    onMainCategorySelected(item, index) {
      var self = this;
      self.selectedMainCategory = item;
      self.obj.olfMainCategoryId = item.id.toString();
      //self.obj.map = self.mapList[index];

      // self.selectedLocation = {
      //   id: null,
      //   name: "",
      //   code: "",
      // };
      self.mainCategorySearchPopup = false;
    },
    refreshTableMainCategory() {
      var self = this;
      self.loading = true;
      self.mainCategoryList = [];
      self.olfMainCategoryApi
        .getList()
        .then((response) => {
          self.mainCategoryList = response.result;
          self.loading = false;
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
          // console.log(data);
        });
    },

    onSearchSubCategory() {
      var self = this;
      self.refreshTableSubCategory();
      self.subCategorySearchPopup = true;
    },
    onSubCategorySelected(item, index) {
      var self = this;
      self.selectedSubCategory = item;
      self.obj.olfSubCategoryId = item.id.toString();
      self.subCategorySearchPopup = false;
    },
    refreshTableSubCategory() {
      var self = this;
      self.loading = true;
      self.mainCategoryList = [];
      self.olfSubCategoryApi
        .getList()
        .then((response) => {
          self.subCategoryList = response.result;
          self.loading = false;
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
          // console.log(data);
        });
    },

    getBuildingCodeName(item) {
      if (item.buildingCode) return item.buildingCode.name;
      else return "N/A";
    },
    addNewOccupantLoadFactor() {
      this.addNewOccupantLoadFactorPopup = true;
    },
    getMainCategoryName(item) {
      if (item.olfMainCategory) return item.olfMainCategory.name;
      return "N/A";
    },
    getSubCategoryName(item) {
      if (item.olfSubCategory) return item.olfSubCategory.name;
      return "N/A";
    },
    onSearchOccupantLoadFactor() {
      var self = this;
      self.refreshTableOccupantLoadFactor();
      self.occupantLoadFactorSearchPopup = true;
    },
    // onOccupantLoadFactorSelected(item, index) {
    //   var self = this;
    //   alert('asds')
    //   self.selectedOccupantLoadFactor = item;
    //   self.roomSettingObj.occupantLoadFactorId = item.id.toString();

    //   self.occupantLoadFactorSearchPopup = false;
    // },
    refreshTableOccupantLoadFactor() {
      var self = this;
      self.occupantLoadFactorApi
        .getList()
        .then((response) => {
          self.occupantLoadFactorList = response.result;
          console.log(
            "self.occupantLoadFactorList",
            self.occupantLoadFactorList
          );
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
          // console.log(data);
        });
    },
    onOccupantLoadFactorSelected(item, index) {
      console.log("onOccupantLoadFactorSelected", item);
      var self = this;
      self.selectedOccupantLoadFactor = item;
      self.roomSettingObj.occupantLoadFactorId = item.id.toString();
      self.occupantLoadFactorSearchPopup = false;
    },
    obstacleLabelClick(item) {
      if (this.drawType == "") this.obstacleSettingClick(item);
    },
    obstacleSettingClick(item) {
      var self = this;
      self.obstacleSettingObj = item;
      this.obstacleSettingPopup = true;
    },
    onObstacleSettingDelete() {
      var self = this;

      this.obstacleApi
        .delete(self.obstacleSettingObj.id)
        .then((response) => {
          self.toast("Info", "Delete Success", "success");
          this.$router.go();
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    onObstacleSettingConfirmation() {
      var self = this;
      this.obstacleApi
        .update(self.obstacleSettingObj)
        .then((response) => {
          self.toast("Info", "Update Success", "success");
          this.$router.go();
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },

    roomLabelClick(item) {
      if (this.drawType == "") this.roomSettingClick(item);
    },
    roomSettingClick(item) {
      console.log("roomSettingClick", item);
      var self = this;
      self.roomSettingObj = item;
      self.selectedOccupantLoadFactor = self.roomSettingObj.occupantLoadFactor;

      self.roomDoorList = self.roomSettingObj.roomDoors;

      if (self.roomSettingObj.buildingCodeId) {
        self.olfMainCategoryApi
          .get(self.roomSettingObj.buildingCodeId)
          .then((response) => {
            self.selectedMainCategory = response.result;
            // self.selectedBuildingCodeCategory.name = response.result.name;
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }

      this.roomSettingPopup = true;
    },
    onRoomSettingConfirmation() {
      var self = this;
      if (self.roomSettingObj.minimumNumberOfExitId == "")
        self.roomSettingObj.minimumNumberOfExitId = null;

      if (self.roomSettingObj.occupantLoadFactorId == "")
        self.roomSettingObj.occupantLoadFactorId = null;

      self.roomSettingObj.roomDoors = self.roomDoorList;

      this.roomApi
        .update(self.roomSettingObj)
        .then((response) => {
          self.toast("Info", "Update Success", "success");
          this.$router.go();
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    onRoomSettingDelete() {
      var self = this;
      if (self.roomSettingObj.minimumNumberOfExitId == "")
        self.roomSettingObj.minimumNumberOfExitId = null;

      this.roomApi
        .delete(self.roomSettingObj.id)
        .then((response) => {
          self.toast("Info", "Delete Success", "success");
          this.$router.go();
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    quickReload() {
      this.resetObj();
    },
    quickSave() {
      this.handleSave();
    },
    quickClear() {
      this.handleClear();
    },
    settingClick() {
      alert("settingClick");
    },
    toolClick(item) {
      console.log("toolClick", item);

      switch (item) {
        case "roomAuto":
        case "obstacleAuto":
          {
            this.processRoomAuto();
          }
          break;
        case "travelDistanceAuto":
          this.processTravelDistanceAuto();
          break;
        default:
          this.drawTypeSelect(item);
          break;
      }
    },
    processTravelDistanceAuto() {
      console.log("processTravelDistanceAuto");
      this.showTravelDistancePage = this.drawingMeta.showGrid;
      this.cellSize = parseInt(this.drawingMeta.gridSize);

      this.processTravelPathAndCommonPath();
      this.processDeadEnd();
    },
    processDeadEnd() {
      this.prepareGrid(true);
      this.detectObstacle();
      this.recognizeWalls();
      this.recognizeCorridorStartPos();
      this.recognizeEndPos();
      this.recognizeDeadEndPath();
    },
    processTravelPathAndCommonPath() {
      this.prepareGrid(true);
      this.detectObstacle();
      this.recognizeWalls();
      this.detectDoor();
      this.clearBlockedDoor();
      this.recognizeRoomStartPos();
      this.recognizeEndPos();
      this.recognizeAllTravelPath();
    },
    startSearchForPath(isUpdateColor) {
      this.processing = true;
      this.travelPathResult = [];
      for (let start = 0; start < this.startPosList.length; start++) {
        //this.travelPathResult[start] = [];

        for (let end = 0; end < this.endPosList.length; end++) {
          console.log("this.startPosList[start]", this.startPosList[start]);
          console.log("this.endPosList[end]", this.endPosList[end]);

          let generator = new PathGenerator(
            this.startPosList[start],
            this.endPosList[end],
            this.map
          );
          generator.generate();
          // this.cellsProcessed = generator.cells;
          // this.path = generator.path;

          //this.travelPathResult[start][end] = generator.path;
          this.travelPathResult.push(generator.path);

          if (isUpdateColor) {
            for (let k = 0; k < this.path.length; k++) {
              let i = this.path[k].y;
              let j = this.path[k].x;
              this.grid[i][j] = {
                code: "spot_" + i + "_" + j,
                name: "spot_" + i + "_" + j,
                width: this.cellSize,
                height: this.cellSize,
                x: this.cellSize * i,
                y: this.cellSize * j,
                stroke: "black",
                strokeWidth: 2,
                closed: true,
                fill: "rgb(0, 0, 255)",
              };
            }
          }
        }
      }

      this.processing = false;
    },

    recognizeDeadEndPath() {
      console.log("trecognizeDeadEndPath");

      var self = this;
      this.startSearchForDeadEndPath(false);
      var prevCommonPath = [];
      for (let i = 0; i < this.travelPathResult.length; i++) {
        var path = this.travelPathResult[i];
        if (prevCommonPath.length == 0) {
          prevCommonPath = path;
          continue;
        }

        var commonPathPoints = [];
        for (let a = 0; a < prevCommonPath.length; a++) {
          for (let b = 0; b < path.length; b++) {
            if (prevCommonPath[a].x == path[b].x) {
              if (prevCommonPath[a].y == path[b].y) {
                let i = path[b].y;
                let j = path[b].x;
                commonPathPoints.push(this.cellSize * i, this.cellSize * j);
              }
            }
          }
        }
        if (commonPathPoints.length > 0) {
          var randomColor = Math.floor(Math.random() * 16777215).toString(16);
          randomColor = Math.floor(Math.random() * 16777215).toString(16);
          this.deadEnds.push({
            code: "deadEnd" + (this.deadEnds.length + 1),
            name: "Dead End " + (this.deadEnds.length + 1),
            points: commonPathPoints,
            stroke: "#" + randomColor,
            strokeWidth: this.strokeWidth,
            pointerAtBeginning: true,
            pointerAtEnding: true,
          });

          // this.commonPaths.push({
          //   code: "commonPaths" + (this.commonPaths.length + 1),
          //   name: "CommonPath " + (this.commonPaths.length + 1),
          //   points: commonPathPoints,
          //   stroke: "#" + randomColor,
          //   strokeWidth: this.strokeWidth,
          //   closed: false,
          //   pointerAtBeginning: true,
          //   pointerAtEnding: true,
          // });
        }

        prevCommonPath = path;
      }
    },

    startSearchForDeadEndPath(isUpdateColor) {
      this.processing = true;
      this.travelPathResult = [];
      for (let start = 0; start < this.startPosList.length; start++) {
        for (let end = 0; end < this.endPosList.length; end++) {
          let generator = new PathGenerator(
            this.startPosList[start],
            this.endPosList[end],
            this.map
          );
          generator.generate();
          this.travelPathResult.push(generator.path);
          if (isUpdateColor) {
            for (let k = 0; k < this.path.length; k++) {
              let i = this.path[k].y;
              let j = this.path[k].x;
              this.grid[i][j] = {
                code: "spot_" + i + "_" + j,
                name: "spot_" + i + "_" + j,
                width: this.cellSize,
                height: this.cellSize,
                x: this.cellSize * i,
                y: this.cellSize * j,
                stroke: "black",
                strokeWidth: 2,
                closed: true,
                fill: "rgb(0, 0, 255)",
              };
            }
          }
        }
      }

      this.processing = false;
    },

    recognizeAllTravelPath() {
      var self = this;
      this.startSearchForPath(false);

      var prevCommonPath = [];

      for (let i = 0; i < this.travelPathResult.length; i++) {
        var path = this.travelPathResult[i];
        var points = [];
        for (let k = 0; k < path.length; k++) {
          let i = path[k].y;
          let j = path[k].x;
          points.push(this.cellSize * i, this.cellSize * j);
        }
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);

        this.travelDistances.push({
          code: "travelDistance" + (this.travelDistances.length + 1),
          name: "Travel Distance " + (this.travelDistances.length + 1),
          points: points,
          stroke: "#" + randomColor,
          strokeWidth: this.strokeWidth,
          closed: false,
          pointerAtBeginning: true,
          pointerAtEnding: true,
        });

        if (prevCommonPath.length == 0) {
          prevCommonPath = path;
        } else {
          var commonPathPoints = [];
          for (let a = 0; a < prevCommonPath.length; a++) {
            for (let b = 0; b < path.length; b++) {
              if (prevCommonPath[a].x == path[b].x) {
                if (prevCommonPath[a].y == path[b].y) {
                  let i = path[b].y;
                  let j = path[b].x;
                  commonPathPoints.push(this.cellSize * i, this.cellSize * j);
                }
              }
            }
          }
          if (commonPathPoints.length > 0) {
            randomColor = Math.floor(Math.random() * 16777215).toString(16);
            this.commonPaths.push({
              code: "commonPaths" + (this.commonPaths.length + 1),
              name: "CommonPath " + (this.commonPaths.length + 1),
              points: commonPathPoints,
              stroke: "#" + randomColor,
              strokeWidth: this.strokeWidth,
              closed: false,
              pointerAtBeginning: true,
              pointerAtEnding: true,
            });
          }

          prevCommonPath = path;
        }
      }

      // for (let a = 0; a < this.travelPathResult.length; a++) {
      //   var points = [];
      //   for (let b = 0; b < this.travelPathResult[a].length; b++) {
      //     var path = this.travelPathResult[a][b];
      //     for (let k = 0; k < path.length; k++) {
      //       let i = path[k].y;
      //       let j = path[k].x;
      //       points.push(this.cellSize * i, this.cellSize * j);
      //     }

      //     const randomColor = Math.floor(Math.random()*16777215).toString(16);

      //     this.travelDistances.push({
      //       code: "travelDistance" + (this.travelDistances.length + 1),
      //       name: "Travel Distance " + (this.travelDistances.length + 1),
      //       points: points,
      //       stroke: "#"+ randomColor,
      //       strokeWidth: this.strokeWidth,
      //       closed: false,
      //       pointerAtBeginning: true,
      //       pointerAtEnding: true,
      //     });
      //   }
      // }
      console.log("this.travelDistances", this.travelDistances);
    },
    recognizeTravelPathForAllRooms() {
      var self = this;
      for (let i = 0; i < self.rooms.length; i++) {
        var currentRoom = self.rooms[i];
        let cellStart = this.getCellFromGrid(
          currentRoom.longestPoints[0],
          currentRoom.longestPoints[1]
        );
        var lowestCellCount = [];
        var start = {
          x: cellStart.j,
          y: cellStart.i,
        };
        for (let j = 0; j < self.endPosList.length; j++) {
          var currentEndPos = self.endPosList[j];
          var end = {
            x: currentEndPos.y,
            y: currentEndPos.x,
          };
          var cellPaths = this.recognizeTravelPath(start, end);
          if (lowestCellCount.length == 0) lowestCellCount = cellPaths;
          if (cellPaths.length < lowestCellCount.length)
            lowestCellCount = cellPaths;
        }
        if (lowestCellCount.length == 0) continue;
        var points = [];
        for (let k = 0; k < lowestCellCount.length; k++) {
          let i = lowestCellCount[k].y;
          let j = lowestCellCount[k].x;
          this.grid[i][j] = {
            code: "spot_" + i + "_" + j,
            name: "spot_" + i + "_" + j,
            width: this.cellSize,
            height: this.cellSize,
            x: this.cellSize * i,
            y: this.cellSize * j,
            stroke: "black",
            strokeWidth: 2,
            closed: true,
            fill: "rgb(255, 255, 0, 0.3)",
          };
          points.push(this.cellSize * i, this.cellSize * j);
        }

        this.stroke = "green";
        this.travelDistances.push({
          code: "travelDistance" + (this.travelDistances.length + 1),
          name: "Travel Distance " + (this.travelDistances.length + 1),
          points: points,
          stroke: this.stroke,
          strokeWidth: this.strokeWidth,
          closed: false,
          // lineCap: "round",
          // lineJoin: "round",
          //draggable: true,
        });
      }
    },
    recognizeTravelPath(startPos, endPos) {
      this.processing = true;
      this.cleanPath();
      let generator = new PathGenerator(startPos, endPos, this.map);
      generator.generate();
      this.cellsProcessed = generator.cells;
      var path = generator.path;

      this.processing = false;
      return path;
    },
    detectDoor() {
      var self = this;
      for (let k = 0; k < self.doors.length; k++) {
        var currentDoor = self.doors[k];
        if (currentDoor.points == null) continue;

        var currentPointX = currentDoor.points[0];
        var currentPointY = currentDoor.points[1];
        var nextPointX = currentDoor.points[2];
        var nextPointY = currentDoor.points[3];

        var distanceInPixel = drawing.getDistanceInPixel(
          currentDoor.points[0],
          currentDoor.points[1],
          currentDoor.points[2],
          currentDoor.points[3]
        );
        var totalPoint = Math.round(distanceInPixel / this.cellSize);
        totalPoint = totalPoint + 2;

        for (let j = 0; j < totalPoint; j++) {
          var distancePerPointX =
            (currentDoor.points[currentDoor.points.length - 2] -
              currentDoor.points[0]) /
            totalPoint;
          var distancePerPointY =
            (currentDoor.points[currentDoor.points.length - 1] -
              currentDoor.points[1]) /
            totalPoint;

          var pointX = currentDoor.points[0] + distancePerPointX * (j + 1);
          var pointY = currentDoor.points[1] + distancePerPointY * (j + 1);

          this.detectDoors.push({
            id: "detectDoors_" + this.detectDoors.length,
            x: pointX,
            y: pointY,
            stroke: "red",
          });
        }
      }
    },
    clearBlockedDoor() {
      var self = this;
      for (let i = 0; i < self.detectDoors.length; i++) {
        let cell = this.getCellFromGrid(
          self.detectDoors[i].x,
          self.detectDoors[i].y
        );
        this.map[cell.i][cell.j] = 0;
        this.grid[cell.i][cell.j] = {
          i: cell.i,
          j: cell.j,
          code: "spot_" + cell.i + "_" + cell.j,
          name: "spot_" + cell.i + "_" + cell.j,
          width: this.cellSize,
          height: this.cellSize,
          x: this.cellSize * cell.i,
          y: this.cellSize * cell.j,
          closed: true,
          fill: "white",
        };
      }
    },
    recognizeEndPos() {
      console.log("recognizeEndPos");
      var self = this;
      self.endPosList = [];
      for (let i = 0; i < self.exitStairDoors.length; i++) {
        var currentDoor = self.exitStairDoors[i];
        var centerDoorX = (currentDoor.points[0] + currentDoor.points[2]) / 2;
        var centerDoorY = (currentDoor.points[1] + currentDoor.points[3]) / 2;
        let cell = this.getCellFromGrid(centerDoorX, centerDoorY);

        self.endPosList.push({
          x: cell.j,
          y: cell.i,
        });

        this.map[cell.i][cell.j] = 0;
        this.grid[cell.i][cell.j] = {
          i: cell.i,
          j: cell.j,
          code: "spot_" + cell.i + "_" + cell.j,
          name: "spot_" + cell.i + "_" + cell.j,
          width: this.cellSize,
          height: this.cellSize,
          x: this.cellSize * cell.i,
          y: this.cellSize * cell.j,
          closed: true,
          fill: "rgb(255, 0, 0)",
        };
        this.clearObstacleNearEndPos(cell.i, cell.j);
      }
    },
    clearObstacleNearEndPos(i, j) {
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          var cell_i = i + x;
          var cell_j = j + y;
          if (cell_i == i && cell_j == j) continue;
          this.map[cell_i][cell_j] = 0;
          this.grid[cell_i][cell_j] = {
            i: cell_i,
            j: cell_j,
            code: "spot_" + cell_i + "_" + cell_j,
            name: "spot_" + cell_i + "_" + cell_j,
            width: this.cellSize,
            height: this.cellSize,
            x: this.cellSize * cell_i,
            y: this.cellSize * cell_j,
            closed: true,
            fill: "white",
          };
        }
      }
    },
    recognizeCorridorStartPos() {
      var self = this;
      self.startPosList = [];
      self.deadEndStartPosition = [];

      for (let k = 0; k < self.corridorEnds.length; k++) {
        var current = self.corridorEnds[k];
        if (current.points == null) continue;

        var longestPosition = this.getCenterPosition(current);
        if (longestPosition) {
          self.deadEndStartPosition.push({
            id: "deadEndStartPosition_" + self.deadEndStartPosition.length,
            x: longestPosition.x,
            y: longestPosition.y,
          });

          current.longestPoints = [longestPosition.x, longestPosition.y];

          let cell = this.getCellFromGrid(longestPosition.x, longestPosition.y);

          this.startPosList.push({
            x: cell.j,
            y: cell.i,
          });

          this.map[cell.i][cell.j] = 0;
          this.grid[cell.i][cell.j] = {
            i: cell.i,
            j: cell.j,
            code: "spot_" + cell.i + "_" + cell.j,
            name: "spot_" + cell.i + "_" + cell.j,
            width: this.cellSize,
            height: this.cellSize,
            x: this.cellSize * cell.i,
            y: this.cellSize * cell.j,
            closed: true,
            fill: "rgb(0, 255, 0)",
          };
        }
      }
    },
    recognizeRoomStartPos() {
      var self = this;
      self.startPosList = [];
      self.roomStartPosition = [];

      for (let k = 0; k < self.rooms.length; k++) {
        var currentRoom = self.rooms[k];
        if (currentRoom.points == null) continue;

        var longestPosition = this.getLongestPosition(currentRoom);
        console.log("longestPosition", longestPosition);
        if (longestPosition) {
          self.roomStartPosition.push({
            id: "roomStartPosition_" + self.roomStartPosition.length,
            x: longestPosition.x,
            y: longestPosition.y,
          });

          currentRoom.longestPoints = [longestPosition.x, longestPosition.y];

          let cell = this.getCellFromGrid(longestPosition.x, longestPosition.y);

          this.startPosList.push({
            x: cell.j,
            y: cell.i,
          });

          this.map[cell.i][cell.j] = 0;
          this.grid[cell.i][cell.j] = {
            i: cell.i,
            j: cell.j,
            code: "spot_" + cell.i + "_" + cell.j,
            name: "spot_" + cell.i + "_" + cell.j,
            width: this.cellSize,
            height: this.cellSize,
            x: this.cellSize * cell.i,
            y: this.cellSize * cell.j,
            closed: true,
            fill: "rgb(0, 255, 0)",
          };
        }
      }
    },
    recognizeWalls() {
      console.log("recognizeWalls");
      var self = this;
      for (let i = 0; i < self.walls.length; i++) {
        let cell = this.getCellFromGrid(self.walls[i].x, self.walls[i].y);
        this.map[cell.i][cell.j] = 1;
        this.grid[cell.i][cell.j] = {
          i: cell.i,
          j: cell.j,
          code: "spot_" + cell.i + "_" + cell.j,
          name: "spot_" + cell.i + "_" + cell.j,
          width: this.cellSize,
          height: this.cellSize,
          x: this.cellSize * cell.i,
          y: this.cellSize * cell.j,
          // stroke: "black",
          // strokeWidth: 1,
          closed: true,
          fill: "black",
          // visited: false,
          // wall: false,
        };
      }

      const layer = this.$refs.pathFinderLayer.getStage();
      layer.batchDraw();

      const stage = this.$refs.stage.getStage();
      stage.draw();
    },
    getCellFromGrid(x, y) {
      let row = Math.round(this.originalStageSize.width / this.cellSize);
      let col = Math.round(this.originalStageSize.height / this.cellSize);

      for (var i = 0; i < row; i++) {
        for (var j = 0; j < col; j++) {
          if (
            x >= this.grid[i][j].x &&
            x <= this.grid[i][j].x + this.grid[i][j].width
          ) {
            if (
              y >= this.grid[i][j].y &&
              y <= this.grid[i][j].y + this.grid[i][j].height
            ) {
              return this.grid[i][j];
            }
          }
        }
      }
    },
    prepareGrid(isUpdateColor) {
      this.cleanPath();
      let row = Math.round(this.originalStageSize.width / this.cellSize);
      let col = Math.round(this.originalStageSize.height / this.cellSize);
      // Making a 2D array
      this.map = [];
      for (var i = 0; i < row; i++) {
        this.map[i] = [];
      }
      for (var i = 0; i < row; i++) {
        for (var j = 0; j < col; j++) {
          this.map[i][j] = 0;
        }
      }

      if (isUpdateColor) {
        this.grid = [];
        for (var i = 0; i < row; i++) {
          this.grid[i] = [];
          for (var j = 0; j < col; j++) {
            this.grid[i][j] = {
              i: i,
              j: j,
              code: "spot_" + i + "_" + j,
              name: "spot_" + i + "_" + j,
              width: this.cellSize,
              height: this.cellSize,
              x: this.cellSize * i,
              y: this.cellSize * j,
              stroke: "black",
              strokeWidth: 1,
              closed: true,
              // visited: false,
              // wall: false,
            };
          }
        }
      }
    },

    cleanPath() {
      this.cellsProcessed = [];
      this.path = [];
    },
    detectObstacle() {
      console.log("detectObstacle");
      var self = this;
      for (let k = 0; k < self.obstacles.length; k++) {
        var obstacle = self.obstacles[k];
        if (obstacle.points == null) continue;

        // process point from fist to last
        var firstPointX = obstacle.points[0];
        var firstPointY = obstacle.points[1];
        var lastPointX = obstacle.points[obstacle.points.length - 2];
        var lastPointY = obstacle.points[obstacle.points.length - 1];
        var distanceInPixel = drawing.getDistanceInPixel(
          firstPointX,
          firstPointY,
          lastPointX,
          lastPointY
        );

        var totalPoint = Math.round(distanceInPixel / this.cellSize);
        totalPoint = totalPoint + 2;
        for (let j = 0; j < totalPoint; j++) {
          var distancePerPointX = (lastPointX - firstPointX) / totalPoint;
          var distancePerPointY = (lastPointY - firstPointY) / totalPoint;

          var pointX = firstPointX + distancePerPointX * (j + 1);
          var pointY = firstPointY + distancePerPointY * (j + 1);

          this.walls.push({
            id: "walls_" + this.walls.length,
            x: pointX,
            y: pointY,
            stroke: "red",
          });
        }

        // process the other point

        for (let i = 0; i < obstacle.points.length; i = i + 2) {
          var currentPointX = obstacle.points[i];
          var currentPointY = obstacle.points[i + 1];

          this.walls.push({
            id: "walls_" + this.walls.length,
            x: currentPointX,
            y: currentPointY,
            stroke: "green",
          });

          if (i + 3 < obstacle.points.length) {
            var distanceInPixel = drawing.getDistanceInPixel(
              obstacle.points[i],
              obstacle.points[i + 1],
              obstacle.points[i + 2],
              obstacle.points[i + 3]
            );

            var totalPoint = Math.round(distanceInPixel / this.cellSize);
            totalPoint = totalPoint + 2;
            for (let j = 0; j < totalPoint; j++) {
              var distancePerPointX =
                (obstacle.points[i + 2] - obstacle.points[i]) / totalPoint;
              var distancePerPointY =
                (obstacle.points[i + 3] - obstacle.points[i + 1]) / totalPoint;

              var pointX = obstacle.points[i] + distancePerPointX * (j + 1);
              var pointY = obstacle.points[i + 1] + distancePerPointY * (j + 1);

              this.walls.push({
                id: "walls_" + this.walls.length,
                x: pointX,
                y: pointY,
                stroke: "yellow",
              });
            }
          }
        }
      }
    },
    generateWallBasedOnRoom() {
      var self = this;
      // var pointList = [];
      for (let k = 0; k < self.rooms.length; k++) {
        var currentRoom = self.rooms[k];
        if (currentRoom.points == null) continue;

        this.obstacles.push({
          code: "obstacle" + (this.obstacles.length + 1),
          name: "Obstacle " + (this.obstacles.length + 1),
          points: currentRoom.points,
          stroke: this.drawingMeta.strokeColor,
          strokeWidth: this.drawingMeta.strokeWidth,
          // closed: true,
          // fill: helper.hexToRgbA(
          //   this.drawingMeta.fillColor,
          //   this.drawingMeta.fillOpacity
          // ),
        });

        // for (let i = 0; i < currentRoom.points.length; i = i + 2) {
        //   var currentPointX = currentRoom.points[i];
        //   var currentPointY = currentRoom.points[i + 1];

        //   // pointList.push(currentPointX);
        //   // pointList.push(currentPointY);
        // }
      }
    },
    processRoomAuto() {
      var analysisMethod = "color";
      switch (this.drawingMeta.analysisMethod) {
        case "Color":
          analysisMethod = "color";
          break;
        case "Thickness":
          analysisMethod = "thickness";
          break;
        case "ML/DL":
          analysisMethod = "ml";
          break;
        case "Room":
          this.generateWallBasedOnRoom();
          return;
        default:
          break;
      }
      var color_code = drawing.hexToRgbArray(
        this.drawingMeta.analysisColorCode
      );

      var data = {
        uri: this.floorPlanUrl,
        method: analysisMethod,
        category: this.drawingMeta.analysisCategory,
        output: "/tmp",
        //color
        color_code: color_code,
        //template
        template_threshold: 0.05,
        template_list: [],
        //deeplearning
        colorize: 1,
        postprocess: 0,
      };
      this.loadingDeepFloorPlane = true;
      this.deepFloorPlanApi
        .analyze(data)
        .then((response) => {
          console.log("response", response);
          var points = response.data.points;
          for (let i = 0; i < points.length; i++) {
            var currentRoom = points[i];
            var roomPoints = [];
            for (let j = 0; j < currentRoom.length; j++) {
              roomPoints.push(currentRoom[j][0], currentRoom[j][1]);
            }
            if (response.data.category == "room") {
              this.rooms.push({
                code: "room" + (this.rooms.length + 1),
                name: "Room " + (this.rooms.length + 1),
                points: roomPoints,
                stroke: this.drawingMeta.strokeColor,
                strokeWidth: this.drawingMeta.strokeWidth,
                closed: true,
                fill: helper.hexToRgbA(
                  this.drawingMeta.fillColor,
                  this.drawingMeta.fillOpacity
                ),
              });
            } else if (response.data.category == "wall") {
              this.obstacles.push({
                code: "obstacle" + (this.obstacles.length + 1),
                name: "Obstacle " + (this.obstacles.length + 1),
                points: roomPoints,
                stroke: this.drawingMeta.strokeColor,
                strokeWidth: this.drawingMeta.strokeWidth,
                closed: true,
                fill: helper.hexToRgbA(
                  this.drawingMeta.fillColor,
                  this.drawingMeta.fillOpacity
                ),
              });
            }
          }

          this.loadingDeepFloorPlane = false;
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
          this.loadingDeepFloorPlane = false;
        });
    },
    toolScaleClick() {
      this.drawTypeSelect("scale");
      this.toast(
        "Instruction",
        "Please click two points on the drawing and insert your scale in meter",
        "primary"
      );
    },
    onScaleSettingConfirmation(status, evt, accept) {
      var self = this;
      if (accept) {
        self.obj.scale.lengthInMeter = parseInt(self.newScale);

        this.api
          .updateScale(self.obj)
          .then((response) => {
            self.toast("Error", "Update Success", "success");
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
        this.$router.go();
      }
    },

    drawTypeSelect(draw) {
      if (draw == "cancel") {
        this.handleDone();
        this.drawType = "";
        return;
      }
      this.drawType = draw;
      this.drawingState = "";

      this.analysisMethod = {
        category: "",
        method: "",
      };

      this.updateCursor("crosshair");
      this.stroke = "yellow";
    },
    updateCursor(cursor) {
      let stage = this.$refs.stage.getStage();
      stage.container().style.cursor = cursor;
    },
    handleClear() {
      this.exitSeperations = [];
      this.exitStairWidths = [];
      this.diagonalDistances = [];
      this.travelDistances = [];
      this.commonPaths = [];
      this.deadEnds = [];
      this.rooms = [];
      this.doors = [];
      this.obstacles = [];
      this.exitStairAreas = [];
      this.scales = [];
      this.exitStairDoors = [];
    },
    handleDrawRoom() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.rooms.push({
          code: "room" + (this.rooms.length + 1),
          name: "Room " + (this.rooms.length + 1),
          points: [x, y],

          stroke: this.drawingMeta.strokeColor,
          strokeWidth: this.drawingMeta.strokeWidth,
          closed: true,
          fill: helper.hexToRgbA(
            this.drawingMeta.fillColor,
            this.drawingMeta.fillOpacity
          ),
        });
        this.drawingState = "progress";
        this.handleSaveHistory();
      } else if (this.drawingState === "progress") {
        this.rooms[this.rooms.length - 1].points.push(x, y);
        this.handleSaveHistory();
      } else if (this.drawingState == "end") {
        // this.anchors = [];
        //this.mouseClickPoint = [];
        this.drawingState = "";
        this.handleSaveHistory();
      }
    },
    handleDrawScale() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        // this.anchors.push({
        //   id: Math.round(Math.random() * 10000).toString(),
        //   x: x,
        //   y: y,
        //   stroke: "green",
        // });
        this.mouseClickPoint.push({
          x: x,
          y: y,
        });
        this.obj.scale = {
          code: "scale",
          name: "scale",
          points: [x, y],
          stroke: this.stroke,
          strokeWidth: this.strokeWidth,
          lineCap: "round",
          lineJoin: "round",
          draggable: true,
        };
        this.drawingState = "end";
      } else if (this.drawingState === "end") {
        // if (this.anchors.length > 0) {
        //   this.anchors[this.anchors.length - 1].stroke = "black";
        // }
        // this.anchors.push({
        //   id: Math.round(Math.random() * 10000).toString(),
        //   x: x,
        //   y: y,
        //   stroke: "green",
        // });

        this.obj.scale.points = [
          this.mouseClickPoint[0].x,
          this.mouseClickPoint[0].y,
          x,
          y,
        ];

        // this.anchors = [];
        this.mouseClickPoint = [];
        this.drawingState = "";

        this.scaleSettingPopup = true;
      }
    },

    handleDrawStairExit() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.exitStairAreas.push({
          code: "stairExit" + (this.exitStairAreas.length + 1),
          name: "Exit " + (this.exitStairAreas.length + 1),
          points: [x, y],
          stroke: this.drawingMeta.strokeColor,
          strokeWidth: this.drawingMeta.strokeWidth,
          closed: true,
          fill: helper.hexToRgbA(
            this.drawingMeta.fillColor,
            this.drawingMeta.fillOpacity
          ),
        });
        this.drawingState = "progress";
      } else if (this.drawingState === "progress") {
        this.exitStairAreas[this.exitStairAreas.length - 1].points.push(x, y);
      } else if (this.drawingState == "end") {
        this.drawingState = "";
        this.handleSaveHistory();
      }
    },

    handleDrawStairExitRect() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.exitStairAreas.push({
          code: "stairExit" + (this.exitStairAreas.length + 1),
          name: "Exit " + (this.exitStairAreas.length + 1),
          points: [x, y],
          stroke: this.drawingMeta.strokeColor,
          strokeWidth: this.drawingMeta.strokeWidth,
          closed: true,
          fill: helper.hexToRgbA(
            this.drawingMeta.fillColor,
            this.drawingMeta.fillOpacity
          ),
        });
        this.drawingState = "end";
        this.handleSaveHistory();
      } else if (this.drawingState == "end") {
        var startX =
          this.exitStairAreas[this.exitStairAreas.length - 1].points[0];
        var startY =
          this.exitStairAreas[this.exitStairAreas.length - 1].points[1];

        this.exitStairAreas[this.exitStairAreas.length - 1].points.push(
          startX,
          y
        );
        this.exitStairAreas[this.exitStairAreas.length - 1].points.push(x, y);
        this.exitStairAreas[this.exitStairAreas.length - 1].points.push(
          x,
          startY
        );

        this.drawingState = "";
        this.handleSaveHistory();
      }
    },

    handleDrawDoor() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.doors.push({
          code: "door" + (this.doors.length + 1),
          name: "Door " + (this.doors.length + 1),
          doorType: "Swing In",
          points: [x, y],
          stroke: this.drawingMeta.strokeColor,
          strokeWidth: this.drawingMeta.strokeWidth,
          closed: true,
          fill: helper.hexToRgbA(
            this.drawingMeta.fillColor,
            this.drawingMeta.fillOpacity
          ),
        });
        this.drawingState = "progress";
      } else if (this.drawingState === "progress") {
        this.doors[this.doors.length - 1].points.push(x, y);
      } else if (this.drawingState == "end") {
        this.handleSaveHistory();
      }
    },

    handleDrawDoorVertical() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      var width = parseInt(this.drawingMeta.width);
      var widthInPixel = drawing.convertDistanceMeterToPixel(
        width / 1000,
        this.obj.scale.distanceInMeterForOnePixel
      );

      var depth = parseInt(this.drawingMeta.depth);
      var depthInPixel = drawing.convertDistanceMeterToPixel(
        depth / 1000,
        this.obj.scale.distanceInMeterForOnePixel
      );

      if (this.drawingState === "") {
        this.doors.push({
          code: "door" + (this.doors.length + 1),
          name: "Door " + (this.doors.length + 1),
          doorType: "Swing In",
          points: [
            x,
            y,
            x + depthInPixel,
            y,
            x + depthInPixel,
            y + widthInPixel,
            x,
            y + widthInPixel,
          ],

          stroke: this.drawingMeta.strokeColor,
          strokeWidth: this.drawingMeta.strokeWidth,
          closed: true,
          fill: helper.hexToRgbA(
            this.drawingMeta.fillColor,
            this.drawingMeta.fillOpacity
          ),
        });

        this.drawingState = "";
        this.handleSaveHistory();
      }
    },
    handleDrawDoorHorizontal() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      var width = parseInt(this.drawingMeta.width);
      var widthInPixel = drawing.convertDistanceMeterToPixel(
        width / 1000,
        this.obj.scale.distanceInMeterForOnePixel
      );

      var depth = parseInt(this.drawingMeta.depth);
      var depthInPixel = drawing.convertDistanceMeterToPixel(
        depth / 1000,
        this.obj.scale.distanceInMeterForOnePixel
      );

      console.log("this.drawingMeta.size", this.drawingMeta.size);
      if (this.drawingState === "") {
        this.doors.push({
          code: "door" + (this.doors.length + 1),
          name: "Door " + (this.doors.length + 1),
          doorType: "Swing In",
          points: [
            x,
            y,
            x + widthInPixel,
            y,
            x + widthInPixel,
            y + depthInPixel,
            x,
            y + depthInPixel,
          ],
          stroke: this.drawingMeta.strokeColor,
          strokeWidth: this.drawingMeta.strokeWidth,
          closed: true,
          fill: helper.hexToRgbA(
            this.drawingMeta.fillColor,
            this.drawingMeta.fillOpacity
          ),
        });

        this.drawingState = "";
        this.handleSaveHistory();
      }
    },
    handleDrawObstacle() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.obstacles.push({
          code: "obstacle" + (this.obstacles.length + 1),
          name: "Obstacle " + (this.obstacles.length + 1),
          points: [x, y],
          stroke: this.drawingMeta.strokeColor,
          strokeWidth: this.drawingMeta.strokeWidth,
          closed: true,
          fill: helper.hexToRgbA(
            this.drawingMeta.fillColor,
            this.drawingMeta.fillOpacity
          ),
        });
        this.drawingState = "progress";
      } else if (this.drawingState === "progress") {
        this.obstacles[this.obstacles.length - 1].points.push(x, y);
      } else if (this.drawingState == "end") {
        this.drawingState = "";
        this.handleSaveHistory();
      }
    },

    handleDrawObstacleRect() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.obstacles.push({
          code: "obstacle" + (this.obstacles.length + 1),
          name: "Obstacle " + (this.obstacles.length + 1),
          points: [x, y],
          stroke: this.drawingMeta.strokeColor,
          strokeWidth: this.drawingMeta.strokeWidth,
          closed: true,
          fill: helper.hexToRgbA(
            this.drawingMeta.fillColor,
            this.drawingMeta.fillOpacity
          ),
        });
        this.drawingState = "end";
        this.handleSaveHistory();
      } else if (this.drawingState == "end") {
        var startX = this.obstacles[this.obstacles.length - 1].points[0];
        var startY = this.obstacles[this.obstacles.length - 1].points[1];

        this.obstacles[this.obstacles.length - 1].points.push(startX, y);
        this.obstacles[this.obstacles.length - 1].points.push(x, y);
        this.obstacles[this.obstacles.length - 1].points.push(x, startY);

        this.drawingState = "";
        this.handleSaveHistory();
      }
    },

    handleDrawCorridorEnd() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.corridorEnds.push({
          code: "corridorEnd" + (this.corridorEnds.length + 1),
          name: "Corridor Ends " + (this.corridorEnds.length + 1),
          points: [x, y],
          stroke: this.drawingMeta.strokeColor,
          strokeWidth: this.drawingMeta.strokeWidth,
          closed: true,
          fill: helper.hexToRgbA(
            this.drawingMeta.fillColor,
            this.drawingMeta.fillOpacity
          ),
        });
        this.drawingState = "progress";
      } else if (this.drawingState === "progress") {
        this.corridorEnds[this.corridorEnds.length - 1].points.push(x, y);
      } else if (this.drawingState == "end") {
        this.drawingState = "";
        this.handleSaveHistory();
      }
    },

    handleDrawCorridorEndRect() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.corridorEnds.push({
          code: "corridorEnd" + (this.corridorEnds.length + 1),
          name: "Corridor Ends " + (this.corridorEnds.length + 1),
          points: [x, y],
          stroke: this.drawingMeta.strokeColor,
          strokeWidth: this.drawingMeta.strokeWidth,
          closed: true,
          fill: helper.hexToRgbA(
            this.drawingMeta.fillColor,
            this.drawingMeta.fillOpacity
          ),
        });
        this.drawingState = "end";
        this.handleSaveHistory();
      } else if (this.drawingState == "end") {
        // if (this.anchors.length > 0) {
        //   this.anchors[this.anchors.length - 1].stroke = "black";
        // }
        // this.anchors.push({
        //   id: Math.round(Math.random() * 10000).toString(),
        //   x: x,
        //   y: y,
        //   stroke: "green",
        // });

        var startX = this.corridorEnds[this.corridorEnds.length - 1].points[0];
        var startY = this.corridorEnds[this.corridorEnds.length - 1].points[1];

        this.corridorEnds[this.corridorEnds.length - 1].points.push(startX, y);
        this.corridorEnds[this.corridorEnds.length - 1].points.push(x, y);
        this.corridorEnds[this.corridorEnds.length - 1].points.push(x, startY);

        // this.anchors = [];
        // this.mouseClickPoint = [];
        this.drawingState = "";
        this.handleSaveHistory();
      }
    },

    handleDrawRoomRect() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.rooms.push({
          code: "room" + (this.rooms.length + 1),
          name: "Room " + (this.rooms.length + 1),
          points: [x, y],
          stroke: this.drawingMeta.strokeColor,
          strokeWidth: this.drawingMeta.strokeWidth,
          closed: true,
          fill: helper.hexToRgbA(
            this.drawingMeta.fillColor,
            this.drawingMeta.fillOpacity
          ),
        });
        this.drawingState = "end";
      } else if (this.drawingState == "end") {
        var startX = this.rooms[this.rooms.length - 1].points[0];
        var startY = this.rooms[this.rooms.length - 1].points[1];

        this.rooms[this.rooms.length - 1].points.push(startX, y);
        this.rooms[this.rooms.length - 1].points.push(x, y);
        this.rooms[this.rooms.length - 1].points.push(x, startY);
        this.drawingState = "";
      }

      this.handleSaveHistory();
    },

    handleDrawCommonPath() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.commonPaths.push({
          code: "commonPath" + (this.commonPaths.length + 1),
          name: "Common " + (this.commonPaths.length + 1),
          points: [x, y],
          stroke: this.drawingMeta.strokeColor,
          strokeWidth: this.drawingMeta.strokeWidth,
          fill: this.drawingMeta.strokeColor,
          closed: false,
        });

        this.drawingState = "progress";
      } else if (this.drawingState === "progress") {
        this.commonPaths[this.commonPaths.length - 1].points.push(x, y);
      } else if (this.drawingState === "end") {
        this.drawingState = "";
        this.handleSaveHistory();
      }
    },

    handleDrawDeadEnd() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.deadEnds.push({
          code: "deadEnd" + (this.deadEnds.length + 1),
          name: "Dead End " + (this.deadEnds.length + 1),
          points: [x, y],
          stroke: this.drawingMeta.strokeColor,
          strokeWidth: this.drawingMeta.strokeWidth,
          fill: this.drawingMeta.strokeColor,
          closed: false,
        });

        this.drawingState = "progress";
      } else if (this.drawingState === "progress") {
        this.deadEnds[this.deadEnds.length - 1].points.push(x, y);
      } else if (this.drawingState === "end") {
        this.drawingState = "";
        this.handleSaveHistory();
      }
    },

    handleDrawTravelDistance() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        console.log("this.travelDistances", this.travelDistances);
        console.log("this.travelDistances.length", this.travelDistances.length);
        this.travelDistances.push({
          code: "travelDistance" + (this.travelDistances.length + 1),
          name: "Travel Distance " + (this.travelDistances.length + 1),
          points: [x, y],
          stroke: this.drawingMeta.strokeColor,
          strokeWidth: this.drawingMeta.strokeWidth,
          fill: this.drawingMeta.strokeColor,
          closed: false,
          // lineCap: "round",
          // lineJoin: "round",
          //draggable: true,
        });

        this.drawingState = "progress";
      } else if (this.drawingState === "progress") {
        this.travelDistances[this.travelDistances.length - 1].points.push(x, y);
      } else if (this.drawingState === "end") {
        this.drawingState = "";
        this.handleSaveHistory();
      }
    },

    handleDrawDiagonalDistance() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        // this.anchors.push({
        //   id: Math.round(Math.random() * 10000).toString(),
        //   x: x,
        //   y: y,
        //   stroke: "green",
        // });
        this.mouseClickPoint.push({
          x: x,
          y: y,
        });
        this.diagonalDistances.push({
          code: "diagonalDistance" + (this.diagonalDistances.length + 1),
          name: "Diagonal " + +(this.diagonalDistances.length + 1),
          points: [x, y],
          stroke: this.stroke,
          strokeWidth: this.strokeWidth,
          lineCap: "round",
          lineJoin: "round",
          //draggable: true,
        });

        this.drawingState = "end";
      } else if (this.drawingState === "end") {
        // if (this.anchors.length > 0) {
        //   this.anchors[this.anchors.length - 1].stroke = "black";
        // }
        // this.anchors.push({
        //   id: Math.round(Math.random() * 10000).toString(),
        //   x: x,
        //   y: y,
        //   stroke: "green",
        // });

        this.diagonalDistances[this.diagonalDistances.length - 1].points = [
          this.mouseClickPoint[0].x,
          this.mouseClickPoint[0].y,
          x,
          y,
        ];

        // this.anchors = [];
        this.mouseClickPoint = [];
        this.drawingState = "";
        this.handleSaveHistory();
      }
    },
    handleDrawExitStairWidth() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        // this.anchors.push({
        //   id: Math.round(Math.random() * 10000).toString(),
        //   x: x,
        //   y: y,
        //   stroke: "green",
        // });
        this.mouseClickPoint.push({
          x: x,
          y: y,
        });
        this.exitStairWidths.push({
          code: "exitStairWidth" + (this.exitStairWidths.length + 1),
          name: "Stair " + (this.exitStairWidths.length + 1),
          points: [x, y],
          lineCap: "round",
          lineJoin: "round",
          stroke: this.drawingMeta.strokeColor,
          strokeWidth: this.drawingMeta.strokeWidth,
          closed: true,
        });

        this.drawingState = "end";
      } else if (this.drawingState === "end") {
        // if (this.anchors.length > 0) {
        //   this.anchors[this.anchors.length - 1].stroke = "black";
        // }
        // this.anchors.push({
        //   id: Math.round(Math.random() * 10000).toString(),
        //   x: x,
        //   y: y,
        // });

        this.exitStairWidths[this.exitStairWidths.length - 1].points = [
          this.mouseClickPoint[0].x,
          this.mouseClickPoint[0].y,
          x,
          y,
        ];

        // this.anchors = [];
        this.mouseClickPoint = [];
        this.drawingState = "";
        this.handleSaveHistory();
      }
    },
    handleDrawDoorExit() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.exitStairDoors.push({
          code: "exitStairDoors" + (this.exitStairDoors.length + 1),
          name: "Exit Door " + (this.exitStairDoors.length + 1),
          points: [x, y],
          stroke: this.stroke,
          stroke: this.drawingMeta.strokeColor,
          strokeWidth: this.drawingMeta.strokeWidth,
          closed: true,
          fill: helper.hexToRgbA(
            this.drawingMeta.fillColor,
            this.drawingMeta.fillOpacity
          ),
        });

        this.drawingState = "progress";
      } else if (this.drawingState === "progress") {
        this.exitStairDoors[this.exitStairDoors.length - 1].points.push(x, y);
      } else if (this.drawingState == "end") {
        this.handleSaveHistory();
      }

      this.autoDrawExitSeperation();
    },
    handleDrawDoorExitVertical() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      var distanceToAdd = 20;
      if (this.drawingState === "") {
        this.exitStairDoors.push({
          code: "exitStairDoors" + (this.exitStairDoors.length + 1),
          name: "Exit Door " + (this.exitStairDoors.length + 1),
          doorType: "Swing In",
          points: [x, y, x, y + distanceToAdd],
          stroke: this.stroke,
          strokeWidth: this.strokeWidth,
          closed: true,
          fill: "rgb(58, 141, 243, 0.3)",
        });

        // this.anchors = [];
        this.mouseClickPoint = [];
        this.drawingState = "";
        this.handleSaveHistory();
      }
    },
    handleDrawDoorExitHorizontal() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      var distanceToAdd = 20;
      if (this.drawingState === "") {
        this.exitStairDoors.push({
          code: "exitStairDoors" + (this.exitStairDoors.length + 1),
          name: "Exit Door " + (this.exitStairDoors.length + 1),
          doorType: "Swing In",
          points: [x, y, x + distanceToAdd, y],
          stroke: this.stroke,
          strokeWidth: this.strokeWidth,
          closed: true,
          fill: "rgb(58, 141, 243, 0.3)",
        });

        // this.anchors = [];
        this.mouseClickPoint = [];
        this.drawingState = "";
        this.handleSaveHistory();
      }
    },
    getMiddlePoint(item) {
      return drawing.getMiddlePoint(item);
    },
    getFloorDiagonalPoints() {
      var self = this;
      var pointList = [];
      for (let k = 0; k < self.rooms.length; k++) {
        var currentRoom = self.rooms[k];
        if (currentRoom.points == null) continue;

        for (let i = 0; i < currentRoom.points.length; i = i + 2) {
          var currentPointX = currentRoom.points[i];
          var currentPointY = currentRoom.points[i + 1];
          pointList.push(currentPointX);
          pointList.push(currentPointY);
        }
      }

      var longest = 0;
      var point1 = [];
      var point2 = [];
      for (let i = 0; i < pointList.length; i = i + 2) {
        var currentPointX = pointList[i];
        var currentPointY = pointList[i + 1];

        for (let j = 0; j < pointList.length; j = j + 2) {
          var otherPointX = pointList[j];
          var otherPointY = pointList[j + 1];

          if (currentPointX == otherPointX && currentPointY == otherPointY)
            continue;

          var distance = drawing.getDistanceInPixel(
            currentPointX,
            currentPointY,
            otherPointX,
            otherPointY
          );
          if (distance > longest) {
            point1 = [currentPointX, currentPointY];
            point2 = [otherPointX, otherPointY];
            longest = distance;
          }
        }
      }
      return [point1[0], point1[1], point2[0], point2[1]];
    },

    autoDrawDiagonalDistance() {
      var self = this;

      var points = this.getFloorDiagonalPoints();
      if (points[0] == null) return;

      var point1 = [points[0], points[1]];
      var point2 = [points[2], points[3]];

      this.diagonalDistances = [];
      // this.stroke = "yellow";
      this.diagonalDistances.push({
        code: "diagonalDistances" + (this.diagonalDistances.length + 1),
        name: "Diagonal Distances " + (this.diagonalDistances.length + 1),
        points: [point1[0], point1[1], point2[0], point2[1]],
        // stroke: this.stroke,
        // strokeWidth: this.strokeWidth,
        // lineCap: "round",
        // lineJoin: "round",
        stroke: "rgb(255, 0, 0, 0.5)",
        strokeWidth: 5,
        lineCap: "round",
        lineJoin: "round",
        /*
         * line segments with a length of 33px
         * with a gap of 10px
         */
        dash: [10, 10],
      });

      this.obj.diagonalDistances = this.diagonalDistances;
    },

    autoDrawExitSeperation() {
      var self = this;
      if (this.exitStairDoors.length < 2) {
        self.exitSeperations = [];
        self.obj.exitSeperations = self.exitSeperations;
        return;
      }
      var exitDistanceList = [];
      for (let i = 0; i < self.exitStairDoors.length; i++) {
        for (let j = 0; j < self.exitStairDoors.length; j++) {
          if (i == j) continue;

          var isDuplicate = false;
          for (let k = 0; k < exitDistanceList.length; k++) {
            if (
              exitDistanceList[k].code1 == self.exitStairDoors[i].code &&
              exitDistanceList[k].code2 == self.exitStairDoors[j].code
            ) {
              isDuplicate = true;
            }
            if (
              exitDistanceList[k].code2 == self.exitStairDoors[i].code &&
              exitDistanceList[k].code1 == self.exitStairDoors[j].code
            ) {
              isDuplicate = true;
            }
          }
          if (isDuplicate) continue;
          var center = drawing.getCenterPosition(
            [
              self.exitStairDoors[i].points[0],
              self.exitStairDoors[i].points[1],
            ],
            [self.exitStairDoors[i].points[2], self.exitStairDoors[i].points[3]]
          );
          var center2 = drawing.getCenterPosition(
            [
              self.exitStairDoors[j].points[0],
              self.exitStairDoors[j].points[1],
            ],
            [self.exitStairDoors[j].points[2], self.exitStairDoors[j].points[3]]
          );
          exitDistanceList.push({
            code1: self.exitStairDoors[i].code,
            code2: self.exitStairDoors[j].code,
            x: center[0],
            y: center[1],
            x2: center2[0],
            y2: center2[1],
          });
        }
      }

      this.exitSeperations = [];
      for (let k = 0; k < exitDistanceList.length; k++) {
        this.exitSeperations.push({
          code: "exitSeparation" + (this.exitSeperations.length + 1),
          name: "Separation " + (this.exitSeperations.length + 1),
          points: [
            exitDistanceList[k].x,
            exitDistanceList[k].y,
            exitDistanceList[k].x2,
            exitDistanceList[k].y2,
          ],
          stroke: "rgb(58, 141, 243, 0.3)",
          strokeWidth: 5,
          lineCap: "round",
          lineJoin: "round",
          /*
           * line segments with a length of 33px
           * with a gap of 10px
           */
          dash: [10, 10],
        });
      }

      self.obj.exitSeperations = self.exitSeperations;

      // return exitDistanceList;

      // for (let i = 0; i < this.exitStairDoors.length; i++) {
      //   for (let j = 0; j < this.exitStairDoors.length; j++) {}
      // }
    },
    handleDone() {
      this.drawingState = "end";
      if (this.drawType === "polygon") {
        this.handleDrawPolygon();
      } else if (this.drawType === "travelDistance") {
        this.handleDrawTravelDistance();
      } else if (this.drawType === "commonPath") {
        this.handleDrawCommonPath();
      } else if (this.drawType === "deadEnd") {
        this.handleDrawDeadEnd();
      } else if (this.drawType === "room") {
        this.handleDrawRoom();
      } else if (this.drawType === "stairExit") {
        this.handleDrawStairExit();
      } else if (this.drawType === "stairExitRect") {
        this.handleDrawStairExitRect();
      } else if (this.drawType === "obstacle") {
        this.handleDrawObstacle();
      } else if (this.drawType === "obstacleRect") {
        this.handleDrawObstacleRect();
      } else if (this.drawType === "corridorEnd") {
        this.handleDrawCorridorEnd();
      } else if (this.drawType === "corridorEndRect") {
        this.handleDrawCorridorEndRect();
      } else if (this.drawType === "doors") {
        this.handleDrawDoor();
      } else if (this.drawType === "exitDoor") {
        this.drawingState = "";
        //this.handleDrawDoorExit();
      }
      this.updateCursor("default");
    },
    handleSaveHistory() {
      this.step += 1;

      this.stageHistory = [
        ...this.stageHistory,
        {
          drawType: this.drawType,
          drawingState: this.drawingState,
          rooms: [...this.rooms],
          doors: [...this.doors],
          exitStairAreas: [...this.exitStairAreas],
          exitStairDoors: [...this.exitStairDoors],
          exitStairWidths: [...this.exitStairWidths],
          exitSeperations: [...this.exitSeperations],
          commonPaths: [...this.commonPaths],
          travelDistances: [...this.travelDistances],
          diagonalDistances: [...this.diagonalDistances],
          obstacles: [...this.obstacles],
          corridorEnds: [...this.corridorEnds],
          deadEnds: [...this.deadEnds],
        },
      ];

      console.log("this.step", this.step);
      console.log("this.stageHistory", this.stageHistory);
    },
    handlePrevStep() {
      if (this.step == 0) {
        return;
      } else {
        this.step = this.step - 1;
        let _cur = this.stageHistory[this.step];
        const {
          drawType,
          drawingState,
          rooms,
          doors,
          exitStairAreas,
          exitStairDoors,
          exitStairWidths,
          exitSeperations,
          commonPaths,
          travelDistances,
          diagonalDistances,
          obstacles,
          corridorEnds,
          deadEnds,
        } = _cur;
        this.drawType = drawType;
        this.drawingState = drawingState;
        this.rooms = [...rooms];
        this.doors = [...doors];
        this.exitStairAreas = [...exitStairAreas];
        this.exitStairDoors = [...exitStairDoors];
        this.exitStairWidths = [...exitStairWidths];
        this.exitSeperations = [...exitSeperations];
        this.commonPaths = [...commonPaths];
        this.travelDistances = [...travelDistances];
        this.diagonalDistances = [...diagonalDistances];
        this.obstacles = [...obstacles];
        this.corridorEnds = [...corridorEnds];
        this.deadEnds = [...deadEnds];
      }
    },
    handleNextStep() {
      if (this.step == this.stageHistory.length - 1) {
        return;
      } else {
        this.step = this.step + 1;
        let _cur = this.stageHistory[this.step];
        const {
          drawType,
          drawingState,
          rooms,
          doors,
          exitStairAreas,
          exitStairDoors,
          exitStairWidths,
          exitSeperations,
          commonPaths,
          travelDistances,
          diagonalDistances,
          obstacles,
          corridorEnds,
          deadEnds,
        } = _cur;
        this.drawType = drawType;
        this.drawingState = drawingState;
        this.rooms = [...rooms];
        this.doors = [...doors];
        this.exitStairAreas = [...exitStairAreas];
        this.exitStairDoors = [...exitStairDoors];
        this.exitStairWidths = [...exitStairWidths];
        this.exitSeperations = [...exitSeperations];
        this.commonPaths = [...commonPaths];
        this.travelDistances = [...travelDistances];
        this.diagonalDistances = [...diagonalDistances];
        this.obstacles = [...obstacles];
        this.corridorEnds = [...corridorEnds];
        this.deadEnds = [...deadEnds];
      }
    },
    handleStageMouseDown(e) {
      this.isPaint = true;
      // if (this.analysisMethod.method == "color") {
      //   try {
      //     const mousePos = this.$refs.stage
      //       .getStage()
      //       .getRelativePointerPosition();
      //     const x = mousePos.x;
      //     const y = mousePos.y;
      //     var ctx = this.$refs.layer._konvaNode.canvas.getContext("2d");
      //     var data = ctx.getImageData(x, y, 1, 1).data;
      //     // console.log("data", ctx.getImageData(x, y, 1, 1).data);

      //     this.analysisColorCode = [data[0], data[1], data[2]];
      //     console.log("analysisColorCode", this.analysisColorCode);
      //   } catch (err) {}
      // }
      // if (this.analysisMethod.method == "template") {
      //   const mousePos = this.$refs.stage
      //     .getStage()
      //     .getRelativePointerPosition();
      //   const x = mousePos.x;
      //   const y = mousePos.y;

      //   if (this.analysisTemplateList.length > 2)
      //     this.analysisTemplateList = [];

      //   this.analysisTemplateList.push({
      //     code: "analysisTemplateList" + (this.analysisTemplateList.length + 1),
      //     name:
      //       "analysisTemplateList " + (this.analysisTemplateList.length + 1),
      //     x: x,
      //     y: y,
      //     width: 0,
      //     height: 0,
      //     stroke: Konva.Util.getRandomColor(),
      //     strokeWidth: 1,
      //     // closed: true,
      //     // fill: "rgb(58, 141, 243, 0.3)",
      //   });

      //   // this.analysisTemplateList.push({
      //   //   x: x,
      //   //   y: y,
      //   //   width: 0,
      //   //   height: 0,
      //   //   color: Konva.Util.getRandomColor(),
      //   // });
      // }
    },
    handleStageMouseClick(event) {
      if (event.evt.button == 2) {
        //right click
        // this.handleDone();
        // this.drawType = "";
      } else {
        console.log("handleStageMouseClick", this.drawType);

        if (this.drawType === "scale") {
          this.handleDrawScale();
        } else if (this.drawType === "exitStairWidth") {
          this.handleDrawExitStairWidth();
        } else if (this.drawType === "exitSeparation") {
          this.handleDrawExitSeperation();
        } else if (this.drawType === "diagonalDistance") {
          this.handleDrawDiagonalDistance();
        } else if (this.drawType === "travelDistance") {
          this.handleDrawTravelDistance();
        } else if (this.drawType === "commonPath") {
          this.handleDrawCommonPath();
        } else if (this.drawType === "deadEnd") {
          this.handleDrawDeadEnd();
        } else if (this.drawType === "room") {
          this.handleDrawRoom();
        } else if (this.drawType === "roomRect") {
          this.handleDrawRoomRect();
        } else if (this.drawType === "stairExit") {
          this.handleDrawStairExit();
        } else if (this.drawType === "stairExitRect") {
          this.handleDrawStairExitRect();
        } else if (this.drawType === "obstacle") {
          this.handleDrawObstacle();
        } else if (this.drawType === "obstacleRect") {
          this.handleDrawObstacleRect();
        } else if (this.drawType === "corridorEnd") {
          this.handleDrawCorridorEnd();
        } else if (this.drawType === "corridorEndRect") {
          this.handleDrawCorridorEndRect();
        } else if (this.drawType === "doors") {
          this.handleDrawDoor();
        } else if (this.drawType === "doorVertical") {
          this.handleDrawDoorVertical();
        } else if (this.drawType === "doorHorizontal") {
          this.handleDrawDoorHorizontal();
        } else if (this.drawType === "exitDoor") {
          this.handleDrawDoorExit();
        } else if (this.drawType === "exitDoorVertical") {
          this.handleDrawDoorExitVertical();
        } else if (this.drawType === "exitDoorHorizontal") {
          this.handleDrawDoorExitHorizontal();
        }
      }
    },
    handleSaveSilent() {
      this.handleSaveAndNotify(false);
    },
    handleSave() {
      this.handleSaveAndNotify(true);
    },
    handleSaveAndNotify(notify) {
      var self = this;
      self.obj.lines = this.lines;
      self.obj.scales = this.scales;
      self.obj.polygons = this.polygons;
      self.obj.rooms = this.rooms;
      self.obj.doors = this.doors;

      self.obj.obstacles = this.obstacles;
      self.obj.exitSeperations = this.exitSeperations;
      self.obj.exitStairWidths = this.exitStairWidths;
      self.obj.diagonalDistances = this.diagonalDistances;
      self.obj.travelDistances = this.travelDistances;
      self.obj.commonPaths = this.commonPaths;
      self.obj.exitStairAreas = this.exitStairAreas;
      self.obj.exitStairDoors = this.exitStairDoors;
      self.obj.corridorEnds = this.corridorEnds;
      self.obj.deadEnds = this.deadEnds;
      for (let i = 0; i < self.obj.rooms.length; i++) {
        if (self.obj.rooms[i].minimumNumberOfExitId == "")
          self.obj.rooms[i].minimumNumberOfExitId = null;
      }

      this.api
        .update(self.obj)
        .then((response) => {
          if (notify) self.toast("Save", "Save Success", "success");
          // self.$router.push({ path: "/tenant/floorPlanlist" });
        })
        .catch(({ data }) => {
          if (notify)
            self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },

    onContextMenu(e) {
      let stage = this.$refs.stage.getStage();
      e.evt.preventDefault();
      if (e.target === stage) {
        return;
      }
      var position = {
        left: e.evt.clientX + 4,
        top: e.evt.clientY + 4,
      };

      this.handleDone();
      this.drawTypeSelect(this.drawType);
      // alert('as')

      // this.$refs.menu.open(position);
    },
    // contextEndDrawingAndContinue() {
    //   this.handleDone();
    //   this.drawTypeSelect(this.drawType);
    //   this.showContextMenu = false;
    // },
    // contextEndDrawing() {
    //   this.handleDone();
    //   this.drawType = "";
    //   this.showContextMenu = false;
    // },
    handleStageMouseUp(e) {
      this.isPaint = false;
      console.log("analysisTemplateList", this.analysisTemplateList);
    },
    handleStageMouseMove() {
      if (!this.isPaint) {
        return;
      }
      if (this.analysisMethod.method == "template") {
        const mousePos = this.$refs.stage
          .getStage()
          .getRelativePointerPosition();
        const x = mousePos.x;
        const y = mousePos.y;
        // this.moveTo.x = x;
        // this.moveTo.y = y;
        const oldX =
          this.analysisTemplateList[this.analysisTemplateList.length - 1].x;
        const oldY =
          this.analysisTemplateList[this.analysisTemplateList.length - 1].y;
        this.analysisTemplateList[this.analysisTemplateList.length - 1].width =
          x - oldX;
        this.analysisTemplateList[this.analysisTemplateList.length - 1].height =
          y - oldY;
      }
    },
    onMouseOut() {
      this.toolTip.visible = false;
    },

    getCenterOfShape(points) {
      return drawing.getCenterOfShape(points);
    },
    getRoomInfo(item) {
      var code = item.name;
      var area = this.getPolygonAreaInMeter(item);
      return code + "\n" + area + " m 2";
    },
    getPolygonAreaInMeter(item) {
      var areaInPixel = this.getPolygonArea(item);
      var areaInMeter =
        areaInPixel *
        this.obj.scale.distanceInMeterForOnePixel *
        this.obj.scale.distanceInMeterForOnePixel;
      areaInMeter = Math.round(areaInMeter * 1000) / 1000;

      return areaInMeter;
    },
    onMouseMove(item) {
      // let stage = this.$refs.stage.getStage();
      // var mousePos = stage.getPointerPosition();
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      this.toolTip.x = mousePos.x + 5;
      this.toolTip.y = mousePos.y + 5;
      this.toolTip.text = item.name;
      this.toolTip.visible = true;
    },
    getPolygonArea(item) {
      var X = [];
      var Y = [];
      for (let i = 0; i < item.points.length; i++) {
        if (i % 2 == 0) X.push(item.points[i]);
        else Y.push(item.points[i]);
      }
      return this.polygonArea(X, Y, X.length);
    },
    polygonArea(X, Y, n) {
      // Initialize area
      let area = 0.0;

      // Calculate value of shoelace formula
      let j = n - 1;
      for (let i = 0; i < n; i++) {
        area += (X[j] + X[i]) * (Y[j] - Y[i]);

        // j is previous vertex to i
        j = i;
      }

      // Return absolute value
      return Math.abs(area / 2.0);
    },
  },
};
</script>

<style>
.work-component {
  display: inline-block;
  position: absolute;
  z-index: 100;
  right: 0;
  width: 320px;
  top: 100px;
  /* width: 100%;
  height: 100vh; */
}
.top-mid {
  float: left;
  z-index: 3;
  position: fixed;
  left: 500px;
  top: 20px;
}

.top-left {
  float: left;
  z-index: 3;
  position: fixed;
  left: 20px;
  top: 20px;
}

.top-right {
  float: right;
  z-index: 3;
  position: fixed;
  right: 50px;
  top: 20px;
}

.bottom-right {
  float: right;
  z-index: 3;
  position: fixed;
  bottom: 0;
  right: 0;
}
</style>