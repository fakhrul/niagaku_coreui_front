<template>
  <div>
    <context-menu :display="showContextMenu" ref="menu">
      <ul>
        <li @click="contextEndDrawingAndContinue">End and continue</li>
        <li @click="contextEndDrawing">End drawing</li>
        <!-- <li>List item 2</li> -->
      </ul>
    </context-menu>
    <div>
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
      <div class="work-tools" v-if="showToolBox">
        <WorkTools
          @scaleClick="scaleClick"
          @roomClick="roomClick"
          @roomRectClick="roomRectClick"
          @stairClick="stairClick"
          @stairWidthClick="stairWidthClick"
          @exitSeperationClick="exitSeperationClick"
          @diagonalDistanceClick="diagonalDistanceClick"
          @travelDistanceClick="travelDistanceClick"
          @travelDistanceAutoClick="travelDistanceAutoClick"
          @commonPathClick="commonPathClick"
          @obstacleClick="obstacleClick"
          @doorClick="doorClick"
          @doorVerticalClick="doorVerticalClick"
          @doorHorizontalClick="doorHorizontalClick"
          @exitDoorClick="exitDoorClick"
          @roomAutoClick="roomAutoClick"
          @analyzeClick="analyzeClick"
        />
      </div>
      <div class="analysis-tool-template" v-if="isShowAnalysisToolTemplate()">
        <AnalysisToolTemplate
          @startClick="analyzeStartClick"
          :template="analysisTemplateList"
        />
      </div>
      <div class="analysis-tool-template" v-if="isShowAnalysisToolThickness()">
        <AnalysisToolThickness
          @startClick="analyzeStartClick"
          :category="analysisMethod.category"
          :method="analysisMethod.method"
          instruction="Please click start to begin."
        />
      </div>
      <div class="analysis-tool-template" v-if="isShowAnalysisToolLearning()">
        <AnalysisToolLearning
          @startClick="analyzeStartClick"
          :category="analysisMethod.category"
          :method="analysisMethod.method"
          instruction="Please click start to begin."
        />
      </div>
      <div class="analysis-tool-template" v-if="isShowAnalysisToolColor()">
        <AnalysisToolColor
          @startClick="analyzeStartClick"
          :colorCode="analysisColorCode"
          :category="analysisMethod.category"
          :method="analysisMethod.method"
          instruction="Please click on wall to select color. Then click start."
        />
      </div>
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
      <!-- <div class="work-navigation">
        <WorkNavigation />
      </div> -->
      <div class="btn-container" v-if="showTravelDistancePage">
        <button @click="btnPrepareGrid">Prepare Grid</button>
        <button @click="btnDetectObstacle">Detect Obstacle</button>
        <button @click="btnRecognizeWall">Recognize Wall</button>
        <button @click="btnClearBlockDoor">Clear Blocked Door</button> -->
        <button @click="btnRecognizeRoomStartPos">Recognize Start Pos</button>
        <button @click="btnRecognizeEndPos">Recognize End Pos</button>
        <button @click="btnStartSearchForPath">Process Path</button>
        <button @click="btnPathStart">Start Pos(Manual)</button>
        <button @click="btnPathEnd">End Pos(Manual)</button>
        <button @click="btnPathWall">Wall Pos(Manual)</button>
        <button @click="btnTravelDistanceReset">Reset Path</button>
      </div>
      <div>
        <div v-if="loadingDeepFloorPlane" style="overflow: auto">
          <CRow class="align-self-center">
            <CCol class="align-self-start"> </CCol>
            <CCol class="align-self-center"> <CSpinner /></CCol>
            <CCol class="align-self-end"> </CCol>
          </CRow>
        </div>
        <div v-if="!loadingDeepFloorPlane">
          <CRow>
            <CCol sm="12">
              <div>
                <v-stage
                  ref="stage"
                  :config="stageSize"
                  @click="handleStageMouseClick"
                  @contextmenu="onContextMenu"
                  @mousedown="handleStageMouseDown"
                  @mouseup="handleStageMouseUp"
                  @mousemove="handleStageMouseMove"
                  style="border: 1px solid #000000; overflow: auto"
                >
                  <v-layer ref="layer">
                    <v-image
                      ref="image"
                      :config="{
                        x: image_start_pos_x,
                        y: image_start_pos_y,
                        image: image,
                      }"
                    />
                    <v-rect
                      v-for="item in analysisTemplateList"
                      :key="item.code"
                      :config="item"
                    />
                    <v-text
                      ref="text"
                      :config="{
                        x: point_x,
                        y: point_y,
                        text: point_text,
                        fontSize: 15,
                      }"
                    />
                    <v-line
                      v-for="(item, index) in lines"
                      :key="item.code"
                      :config="item"
                    />
                    <!-- <v-line :config="obj.scale" /> -->

                    <v-line
                      v-for="(item, index) in polygons"
                      :key="item.code"
                      :config="item"
                    />
                    <template v-for="(item, index) in rooms">
                      <v-line
                        :key="item.code"
                        :config="item"
                        @mousemove="onMouseMove(item)"
                        @mouseout="onMouseOut"
                        @click="roomLabelClick(item)"
                      />
                      <v-label
                        :key="item.code + 'label'"
                        :config="{
                          x: getCenterOfShape(item.points)[0], // item.points[0],
                          y: getCenterOfShape(item.points)[1], //item.points[1],
                        }"
                      >
                        <v-text
                          :config="{
                            text: getRoomInfo(item),
                            fill: 'green',
                          }"
                        />
                      </v-label>
                    </template>

                    <!-- <v-line
                    v-for="(item, index) in obstacles"
                    :key="item.code"
                    :config="item"
                  /> -->

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
                      <v-line :key="item.code" :config="item" />
                      <v-label
                        :key="item.code + 'label'"
                        :config="{
                          x: item.points[0],
                          y: item.points[1],
                        }"
                        @click="commonPathLabelClick(item)"
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

                    <!-- <template v-for="item in fslRooms">

                    </template> -->

                    <v-text
                      ref="text"
                      v-for="item in texts"
                      :key="item.code"
                      :config="item"
                    />
                    <v-circle
                      @click="handleClickOnPolygonNode"
                      v-for="item in anchors"
                      :key="item.id"
                      :config="{
                        id: item.id,
                        x: item.x,
                        y: item.y,
                        radius: 4,
                        fill: 'white',
                        stroke: item.stroke,
                        draggable: true,
                      }"
                    />
                    <!-- poligon end -->
                    <v-transformer ref="transformer" :config="transfer" />
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
                      </div>
                    </v-layer>
                  </div>
                </v-stage>
              </div>
            </CCol>

            <!-- <CCol sm="3">
            <div>
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
          </CCol> -->
          </CRow>
        </div>
      </div>
    </div>
    <div>
      <CModal
        title="Scale Setting"
        :show.sync="scaleSettingPopup"
        size="xl"
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
      <CModal
        title="Work Setting"
        :show.sync="workSettingPopup"
        size="xl"
        @update:show="onWorkSettingConfirmation"
      >
        <CForm>
          <!-- <CInput label="Id" v-model="obj.id" horizontal plaintext /> -->
          <CInput label="Name" horizontal v-model="obj.name" />
          <CInput label="Description" horizontal v-model="obj.description" />
          <CRow form class="form-group">
            <CCol tag="label" sm="3" class="col-form-label"> High Rise? </CCol>
            <CCol sm="9">
              <CSwitch
                class="mr-1"
                color="primary"
                :checked.sync="obj.isHighRise"
                label-on="YES"
                label-off="NO"
              />
            </CCol>
          </CRow>
          <CRow form class="form-group">
            <CCol tag="label" sm="3" class="col-form-label">
              Sprinklered?
            </CCol>
            <CCol sm="9">
              <CSwitch
                class="mr-1"
                color="primary"
                :checked.sync="obj.isSprinkleredBuilding"
                label-on="YES"
                label-off="NO"
              />
            </CCol>
          </CRow>
          <CSelect
            label="Occupancy Load Main Category"
            horizontal
            :options="mainClassificationList"
            :value.sync="mainClassificationId"
          >
          </CSelect>
          <CSelect
            label="Building Code"
            horizontal
            :options="buildingRuleList"
            :value.sync="buildingRuleId"
          >
          </CSelect>
          <CRow form class="form-group">
            <CCol tag="label" sm="3" class="col-form-label"> Image </CCol>
            <CCol sm="9">
              <CImg
                :src="floorPlanUrl"
                class="mb-2"
                width="100%"
                v-if="obj.documentId"
              />
            </CCol>
          </CRow>
          <CRow form class="form-group">
            <CCol tag="label" sm="3" class="col-form-label"> </CCol>
            <CCol sm="9">
              <WidgetsUploadImage
                :floorPlanUrl="floorPlanUrl"
                @uploaded="uploaded"
              />
            </CCol>
          </CRow>
        </CForm>
        <div slot="footer" class="w-100">
          <CButton
            class="ml-1 mr-1 float-right"
            color="primary"
            @click="onFloorPlanConfirmation"
          >
            OK
          </CButton>
          <CButton
            class="ml-1 mr-1 float-right"
            color="danger"
            @click="onFloorPlanDelete"
          >
            Delete
          </CButton>
          <CButton
            class="ml-1 mr-1 float-right"
            color="secondary"
            @click="workSettingPopup = false"
          >
            Cancel
          </CButton>
        </div>
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
                v-model="selectedBuildingCodeCategory.name"
              >
                <template #append>
                  <CButton
                    color="primary"
                    @click="onSearchBuildingCodeCategory()"
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
              <!-- <CInput
                label="Total Door Swing Out"
                horizontal
                v-model="roomSettingObj.totalDoorSwingIn"
              />
              <CInput
                label="Total Door Swing In"
                horizontal
                v-model="roomSettingObj.totalDoorSwingOut"
              />
              <CInput
                label="Total Door Swing Both"
                horizontal
                v-model="roomSettingObj.totalDoorSwingBoth"
              /> -->
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
      <CModal title="Room Door Setting" :show.sync="doorSettingPopup" size="xl">
        <CRow>
          <CCol sm="12">
            <CForm>
              <!-- <CInput label="Id" v-model="obj.id" horizontal plaintext /> -->
              <CInput
                label="Code"
                horizontal
                v-model="doorSettingObj.code"
                readonly
              />
              <CInput label="Name" horizontal v-model="doorSettingObj.name" />
              <CSelect
                label="Door Type"
                horizontal
                :options="['Swing In', 'Swing Out', 'Swing Both']"
                :value.sync="doorSettingObj.doorType"
              >
              </CSelect>
              <CInput
                label="Distance (m)"
                horizontal
                :value="doorSettingObj.distance"
                readonly
              />
              <CInput
                label="Location 1 (px)"
                horizontal
                :value="getCoordinateFirst(doorSettingObj)"
                readonly
              />
              <CInput
                label="Location 2 (px)"
                horizontal
                :value="getCoordinateSecond(doorSettingObj)"
                readonly
              />
              <CInput
                label="Center Between 1 and 2"
                horizontal
                :value="getCenterPositionForDisplay(doorSettingObj)"
                readonly
              />
            </CForm>
          </CCol>
        </CRow>
        <div slot="footer" class="w-100">
          <CButton
            class="ml-1 mr-1 float-right"
            color="primary"
            @click="onDoorSettingConfirmation"
          >
            OK
          </CButton>
          <CButton
            class="ml-1 mr-1 float-right"
            color="danger"
            @click="onDoorSettingDelete"
          >
            Delete
          </CButton>
          <CButton
            class="ml-1 mr-1 float-right"
            color="secondary"
            @click="doorSettingPopup = false"
          >
            Cancel
          </CButton>
        </div>
      </CModal>
    </div>
    <div>
      <CModal
        title="Exit Area Setting"
        :show.sync="exitAreaSettingPopup"
        size="xl"
      >
        <CRow>
          <CCol sm="12">
            <CForm>
              <!-- <CInput label="Id" v-model="obj.id" horizontal plaintext /> -->
              <CInput
                label="Code"
                horizontal
                v-model="exitAreaSettingObj.code"
                readonly
              />
            </CForm>
          </CCol>
        </CRow>
        <div slot="footer" class="w-100">
          <CButton
            class="ml-1 mr-1 float-right"
            color="primary"
            @click="onExitAreaSettingConfirmation"
          >
            OK
          </CButton>
          <CButton
            class="ml-1 mr-1 float-right"
            color="danger"
            @click="onExitAreaSettingDelete"
          >
            Delete
          </CButton>
          <CButton
            class="ml-1 mr-1 float-right"
            color="secondary"
            @click="exitAreaSettingPopup = false"
          >
            Cancel
          </CButton>
        </div>
      </CModal>
    </div>

    <div>
      <CModal
        title="Exit Stair Setting"
        :show.sync="exitStairWidthSettingPopup"
        size="xl"
      >
        <CRow>
          <CCol sm="12">
            <CForm>
              <!-- <CInput label="Id" v-model="obj.id" horizontal plaintext /> -->
              <CInput
                label="Code"
                horizontal
                v-model="exitStairWidthSettingObj.code"
                readonly
              />
            </CForm>
          </CCol>
        </CRow>
        <div slot="footer" class="w-100">
          <CButton
            class="ml-1 mr-1 float-right"
            color="primary"
            @click="onExitStairWidthSettingConfirmation"
          >
            OK
          </CButton>
          <CButton
            class="ml-1 mr-1 float-right"
            color="danger"
            @click="onExitStairWidthSettingDelete"
          >
            Delete
          </CButton>
          <CButton
            class="ml-1 mr-1 float-right"
            color="secondary"
            @click="exitStairWidthSettingPopup = false"
          >
            Cancel
          </CButton>
        </div>
      </CModal>
    </div>

    <div>
      <CModal
        title="Stair Exit Door Setting"
        :show.sync="exitDoorSettingPopup"
        size="xl"
      >
        <CRow>
          <CCol sm="12">
            <CForm>
              <!-- <CInput label="Id" v-model="obj.id" horizontal plaintext /> -->
              <CInput
                label="Code"
                horizontal
                v-model="exitDoorSettingObj.code"
                readonly
              />
            </CForm>
          </CCol>
        </CRow>
        <div slot="footer" class="w-100">
          <CButton
            class="ml-1 mr-1 float-right"
            color="primary"
            @click="onExitDoorSettingConfirmation"
          >
            OK
          </CButton>
          <CButton
            class="ml-1 mr-1 float-right"
            color="danger"
            @click="onExitDoorSettingDelete"
          >
            Delete
          </CButton>
          <CButton
            class="ml-1 mr-1 float-right"
            color="secondary"
            @click="exitDoorSettingPopup = false"
          >
            Cancel
          </CButton>
        </div>
      </CModal>
    </div>

    <div>
      <CModal
        title="Exit Separation Setting"
        :show.sync="exitSeperationSettingPopup"
        size="xl"
      >
        <CRow>
          <CCol sm="12">
            <CForm>
              <!-- <CInput label="Id" v-model="obj.id" horizontal plaintext /> -->
              <CInput
                label="Code"
                horizontal
                v-model="exitSeperationSettingObj.code"
                readonly
              />
            </CForm>
          </CCol>
        </CRow>
        <div slot="footer" class="w-100">
          <CButton
            class="ml-1 mr-1 float-right"
            color="primary"
            @click="onExitSeperationSettingConfirmation"
          >
            OK
          </CButton>
          <CButton
            class="ml-1 mr-1 float-right"
            color="danger"
            @click="onExitSeperationSettingDelete"
          >
            Delete
          </CButton>
          <CButton
            class="ml-1 mr-1 float-right"
            color="secondary"
            @click="exitSeperationSettingPopup = false"
          >
            Cancel
          </CButton>
        </div>
      </CModal>
    </div>

    <div>
      <CModal
        title="Diagonal Distance Setting"
        :show.sync="diagonalDistanceSettingPopup"
        size="xl"
      >
        <CRow>
          <CCol sm="12">
            <CForm>
              <!-- <CInput label="Id" v-model="obj.id" horizontal plaintext /> -->
              <CInput
                label="Code"
                horizontal
                v-model="diagonalDistanceSettingObj.code"
                readonly
              />
            </CForm>
          </CCol>
        </CRow>
        <div slot="footer" class="w-100">
          <CButton
            class="ml-1 mr-1 float-right"
            color="primary"
            @click="onDiagonalDistanceSettingConfirmation"
          >
            OK
          </CButton>
          <CButton
            class="ml-1 mr-1 float-right"
            color="danger"
            @click="onDiagonalDistanceSettingDelete"
          >
            Delete
          </CButton>
          <CButton
            class="ml-1 mr-1 float-right"
            color="secondary"
            @click="diagonalDistanceSettingPopup = false"
          >
            Cancel
          </CButton>
        </div>
      </CModal>
    </div>
    <div>
      <CModal
        title="Common Path Setting"
        :show.sync="commonPathSettingPopup"
        size="xl"
      >
        <CRow>
          <CCol sm="12">
            <CForm>
              <!-- <CInput label="Id" v-model="obj.id" horizontal plaintext /> -->
              <CInput
                label="Code"
                horizontal
                v-model="commonPathSettingObj.code"
                readonly
              />
            </CForm>
          </CCol>
        </CRow>
        <div slot="footer" class="w-100">
          <CButton
            class="ml-1 mr-1 float-right"
            color="primary"
            @click="onCommonPathSettingConfirmation"
          >
            OK
          </CButton>
          <CButton
            class="ml-1 mr-1 float-right"
            color="danger"
            @click="onCommonPathSettingDelete"
          >
            Delete
          </CButton>
          <CButton
            class="ml-1 mr-1 float-right"
            color="secondary"
            @click="commonPathSettingPopup = false"
          >
            Cancel
          </CButton>
        </div>
      </CModal>
    </div>
    <div>
      <CModal
        title="Travel Distance Setting"
        :show.sync="travelDistanceSettingPopup"
        size="xl"
      >
        <CRow>
          <CCol sm="12">
            <CForm>
              <!-- <CInput label="Id" v-model="obj.id" horizontal plaintext /> -->
              <CInput
                label="Code"
                horizontal
                v-model="travelDistanceSettingObj.code"
                readonly
              />
            </CForm>
          </CCol>
        </CRow>
        <div slot="footer" class="w-100">
          <CButton
            class="ml-1 mr-1 float-right"
            color="primary"
            @click="onTravelDistanceSettingConfirmation"
          >
            OK
          </CButton>
          <CButton
            class="ml-1 mr-1 float-right"
            color="danger"
            @click="onTravelDistanceSettingDelete"
          >
            Delete
          </CButton>
          <CButton
            class="ml-1 mr-1 float-right"
            color="secondary"
            @click="travelDistanceSettingPopup = false"
          >
            Cancel
          </CButton>
        </div>
      </CModal>
    </div>
    <div>
      <CModal
        title="Obstacle Setting"
        :show.sync="obstacleSettingPopup"
        size="xl"
      >
        <CRow>
          <CCol sm="12">
            <CForm>
              <!-- <CInput label="Id" v-model="obj.id" horizontal plaintext /> -->
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
      <CModal
        title="Search Category"
        :show.sync="buildingCodeCategorySearchPopup"
        size="lg"
      >
        <CRow>
          <CCol sm="12">
            <CDataTable
              :items="computedBuildingCodeCategoryList"
              :fields="buildingCodeCategoryFieldList"
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
import Konva from "konva";
import FloorPlanApi from "../../lib/floorPlanApi";
// import BuildingRuleApi from "../../lib/buildingRuleApi";
import BuildingCodeApi from "../../lib/buildingCodeApi";
import OlfMainCategoryApi from "../../lib/olfMainCategoryApi";
import RoomApi from "../../lib/roomApi";
import DoorApi from "../../lib/doorApi";

import ExitStairWidthApi from "../../lib/exitStairWidthApi";
import ExitStairDoorApi from "../../lib/exitStairDoorApi";
import ObstacleApi from "../../lib/obstacleApi";
import DiagonalDistanceApi from "../../lib/diagonalDistanceApi";
import TravelDistanceApi from "../../lib/travelDistanceApi";

import OccupantLoadFactorApi from "../../lib/occupantLoadFactorApi";

import WorkTools from "./WorkTools";
import WidgetsUploadImage from "../widgets/WidgetsUploadImage";
import WorkComponents from "./WorkComponents";
import WorkNavigation from "./WorkNavigation.vue";

import ContextMenu from "./ContextMenu.vue";
// import PathFinder from "../../lib/pathFinder";
import PathGenerator from "../../lib/pathGenerator";
import mapExample from "../../data/mapExample.json";

import DeepFloorPlanApi from "../../lib/deepFloorPlanApi";

import AnalysisToolTemplate from "./AnalysisToolTemplate.vue";
import AnalysisToolThickness from "./AnalysisToolThickness.vue";
import AnalysisToolLearning from "./AnalysisToolLearning.vue";
import AnalysisToolColor from "./AnalysisToolColor.vue";

const width = 800; //window.innerWidth;
const height = 800; //window.innerHeight;

const buildingCodeCategoryList = [];
const buildingCodeCategoryFieldList = [
  // { key: "id", _style: "min-width:50px" },
    
  { key: "buildingCodeCategoryCode" },
  { key: "name", _style: "min-width:200px;" },
  {
    key: "show_details",
    label: "",
    _style: "width:1%",
    sorter: false,
    filter: false,
  },
];

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

const fslRooms = [];
export default {
  name: "Workspace",
  components: {
    WorkTools,
    WidgetsUploadImage,
    WorkComponents,
    WorkNavigation,
    ContextMenu,
    AnalysisToolTemplate,
    AnalysisToolThickness,
    AnalysisToolLearning,
    AnalysisToolColor,
  },

  data() {
    return {
      analysisColorCode: [0, 0, 0],
      analysisTemplateList: [],
      analysisMethod: "",
      loadingDeepFloorPlane: false,
      // image_start_pos_x: 100,
      // image_start_pos_y: 100,
      image_start_pos_x: 0,
      image_start_pos_y: 0,
      deepFloorPlanApi: new DeepFloorPlanApi(),
      // isAutoPoll: false,
      // paused: false,
      // stepsAllowed: 0,
      // pathFinder: new PathFinder(),
      roomStartPosition: [],
      walls: [],
      detectDoors: [],
      pathDrawingType: "",
      processing: false,
      grid: [],
      travelPathResult: [],
      startPosList: [],
      //endPosLis: [],
      endPosList: [],
      cellsProcessed: [],
      path: [],
      map: null,
      cellSize: 10,

      showTravelDistancePage: false,
      showComponent: false,
      showToolBox: true,
      showContextMenu: false,

      toolTip: {
        x: 0,
        y: 0,
        text: "",
        visible: false,
      },
      roomDoorSearchPopup: false,
      roomDoorList: roomDoorList.map((item, index) => {
        return { ...item, index };
      }),
      roomDoorFieldList,

      roomExitSeperationFieldList,
      roomDiagonalFieldList,
      doorList: doorList.map((item, id) => {
        return { ...item, id };
      }),
      doorFieldList,

      loading: false,
      buildingCodeCategorySearchPopup: false,
      buildingCodeCategoryList: buildingCodeCategoryList.map((item, id) => {
        return { ...item, id };
      }),
      buildingCodeCategoryFieldList,
      selectedBuildingCodeCategory: {
        id: null,
        name: "",
        code: "",
      },
      roomSettingObj: {},
      exitAreaSettingObj: {},
      doorSettingObj: {},
      exitStairWidthSettingObj: {},
      exitDoorSettingObj: {},
      exitSeperationSettingObj: {},

      diagonalDistanceSettingObj: {},
      commonPathSettingObj: {},
      travelDistanceSettingObj: {},
      obstacleSettingObj: {},

      doorSettingPopup: false,
      uploadedFiles: [],
      roomSettingPopup: false,
      workSettingPopup: false,
      scaleSettingPopup: false,
      exitAreaSettingPopup: false,
      exitStairWidthSettingPopup: false,
      exitDoorSettingPopup: false,
      exitSeperationSettingPopup: false,

      diagonalDistanceSettingPopup: false,
      commonPathSettingPopup: false,
      travelDistanceSettingPopup: false,
      obstacleSettingPopup: false,

      newScale: 0,
      stroke: "black",
      strokeWidth: 4,
      // stageSize: { width: width, height: height },
      stageSize: {
        width: 0,
        height: 0,
        draggable: true,
      },
      image: null,
      point_text: "",
      point_x: 0,
      point_y: 0,
      infoList: [],
      buildingRuleList: [],
      buildingRuleId: "",
      //
      mainClassificationList: [],
      mainClassificationId: "",
      drawType: "",
      imageConfig: {
        name: "image0",
        width: 0,
        height: 0,
        image: null,
      },
      lines: [],
      scales: [],
      polygons: [],
      exitSeperations: [],
      exitStairWidths: [],
      diagonalDistances: [],
      roomDiagonalDistances: [],
      travelDistances: [],
      exitStairAreas: [],
      exitStairDoors: [],
      commonPaths: [],
      rooms: [],
      obstacles: [],
      doors: [],
      texts: [],
      fslRooms: [],
      anchors: [],
      points: [],
      isPolygonFinished: false,
      closed: false,
      posArr: [],
      transfer: {
        enabledAnchors: ["middle-left", "middle-right"],
        // set minimum width of text
        boundBoxFunc: function (oldBox, newBox) {
          newBox.width = Math.max(30, newBox.width);
          return newBox;
        },
      },
      selectedShapeName: "",
      isPaint: false, // 开始画
      moveFrom: {
        x: 0,
        y: 0,
      },
      moveTo: {
        x: 0,
        y: 0,
      },
      rotated: 0,
      isAddTexting: false,
      stageHistory: [
        {
          lines: [],
          scales: [],
          polygons: [],
          commonPaths: [],
          rooms: [],
          obstacles: [],
          doors: [],
          texts: [],
          exitSeperations: [],
          exitStairWidths: [],
          diagonalDistances: [],
          travelDistances: [],
          exitStairAreas: [],
          exitStairDoors: [],
        },
      ],
      step: 0,
      drawingState: "",
      mouseClickPoint: [],
      buildingCodeApi: new BuildingCodeApi(),
      api: new FloorPlanApi(),
      // buildingRuleApi: new BuildingRuleApi(),
      olfMainCategoryApi: new OlfMainCategoryApi(),
      roomApi: new RoomApi(),
      doorApi: new DoorApi(),
      exitStairWidthApi: new ExitStairWidthApi(),
      exitStairDoorApi: new ExitStairDoorApi(),
      occupantLoadFactorApi: new OccupantLoadFactorApi(),
      diagonalDistanceApi: new DiagonalDistanceApi(),
      travelDistanceApi: new TravelDistanceApi(),
      obstacleApi: new ObstacleApi(),
    };
  },
  created() {
    // const image = new window.Image();
    // image.src = this.floorPlanUrl;
    // image.onload = () => {
    //   this.image = image;
    // };
    // this.pollSearch();
  },

  watch: {
    floorPlanUrl(newVal, oldVal) {
      const image = new window.Image();
      image.src = this.floorPlanUrl;
      image.crossOrigin = "anonymous";
      image.onload = () => {
        console.log("image.onload - image.width", image.width);
        console.log("image.onload - image.height", image.height);
        this.image = image;
        this.stageSize.width = image.width;
        this.stageSize.height = image.height;
        // this.stageSize.width = 3000;
        // this.stageSize.height = 3000;

        var stage = this.$refs.stage.getStage();
        console.log("stage onload", stage);

        // this.prepareGrid();
      };

      if (this.obj.scale == null) {
        this.obj.scale = {
          lengthInMeter: 0,
        };
      }

      this.lines = this.obj.lines;
      this.scales = this.obj.scales;
      this.polygons = this.obj.polygons;

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

      this.autoDrawExitSeperation();
      this.autoDrawDiagonalDistance();

      this.showRoomDiagonalDistance();

      var self = this;
      // self.buildingRuleApi
      //   .getList()
      //   .then((response) => {
      //     self.buildingRules = response.result;
      //     for (let i = 0; i < response.result.length; i++) {
      //       self.buildingRuleList.push({
      //         value: response.result[i].id,
      //         label: response.result[i].name,
      //       });
      //     }
      //     if (this.obj.buildingRuleId)
      //       self.buildingRuleId = this.obj.buildingRuleId;
      //     else self.buildingRuleId = self.buildingRuleList[0].value;
      //   })
      //   .catch(({ data }) => {
      //     self.toast("Error", helper.getErrorMessage(data), "danger");
      //   });

      self.olfMainCategoryApi
        .getList()
        .then((response) => {
          var mainClassifications = response.result;
          for (let i = 0; i < mainClassifications.length; i++) {
            self.mainClassificationList.push({
              value: mainClassifications[i].id,
              label: mainClassifications[i].name,
            });
          }
          if (this.obj.mainClassificationId)
            self.mainClassificationId = this.obj.mainClassificationId;
          else self.mainClassificationId = mainClassifications[0].value;
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
  },
  mounted() {
    // if (this.obj.scale == null) {
    //   this.obj.scale = {
    //     lengthInMeter: 0,
    //   };
    // }
    // this.lines = this.obj.lines;
    // this.scales = this.obj.scales;
    // this.polygons = this.obj.polygons;
    // this.exitSeperations = this.obj.exitSeperations;
    // this.exitStairWidths = this.obj.exitStairWidths;
    // this.diagonalDistances = this.obj.diagonalDistances;
    // this.travelDistances = this.obj.travelDistances;
    // this.commonPaths = this.obj.commonPaths;
    // this.rooms = this.obj.rooms;
    // this.obstacles = this.obj.obstacles;
    // this.doors = this.obj.doors;
    // this.exitStairAreas = this.obj.exitStairAreas;
  },
  props: {
    obj: {},
  },
  computed: {
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
    computedDoorList() {
      var self = this;
      return self.doorList.map((item) => {
        return {
          ...item,
          _classes: [item._classes, item._selected ? "table-selected" : ""],
        };
      });
    },
    computedBuildingCodeCategoryList() {
      var self = this;
      return self.buildingCodeCategoryList.map((item) => {
        return {
          ...item,
          buildingCodeCategoryCode: item.buildingCodeCategory.code,
        };
      });
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
    contextMenuStyle() {
      return {
        top: this.contextMenu.top + "px",
        left: this.contextMenu.left + "px",
      };
    },

    floorPlanUrl() {
      var self = this;
      return (
        process.env.VUE_APP_API_URL + "documents/file/" + self.obj.documentId
      );
    },

    drawingObject() {
      var self = this;
      return self.obj;
    },
  },
  methods: {
    analyzeStartClick() {
      var templates = [];
      if (this.analysisTemplateList) {
        for (let i = 0; i < this.analysisTemplateList.length; i++) {
          templates.push({
            x: Math.round(
              this.analysisTemplateList[i].x - this.image_start_pos_x
            ),
            y: Math.round(
              this.analysisTemplateList[i].y - this.image_start_pos_y
            ),
            h: Math.round(this.analysisTemplateList[i].height),
            w: Math.round(this.analysisTemplateList[i].width),
          });
        }
      }

      var data = {
        uri: this.floorPlanUrl,
        method: this.analysisMethod.method,
        category: this.analysisMethod.category,
        output: "/tmp",
        //color
        color_code: this.analysisColorCode,
        //template
        template_threshold: 0.05,
        template_list: templates,
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
              roomPoints.push(
                currentRoom[j][0] + this.image_start_pos_x,
                currentRoom[j][1] + this.image_start_pos_y
              );
            }
            if (response.data.category == "room") {
              this.stroke = "brown";
              this.strokeWidth = 1;
              this.rooms.push({
                code: "room" + (this.rooms.length + 1),
                name: "Room " + (this.rooms.length + 1),
                points: roomPoints,
                draggable: true,
                stroke: this.stroke,
                strokeWidth: this.strokeWidth,
                closed: true,
                fill: "rgb(255, 0, 0, 0.3)",
              });
            } else if (response.data.category == "wall") {
              this.stroke = "black";
              this.strokeWidth = 1;
              this.obstacles.push({
                code: "obstacle" + (this.obstacles.length + 1),
                name: "Obstacle " + (this.obstacles.length + 1),
                points: roomPoints,
                stroke: this.stroke,
                strokeWidth: this.strokeWidth,
                closed: true,
                fill: "rgb(0, 0, 0, 0.3)",
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
    analysisTemplateStart() {
      var templates = [];
      for (let i = 0; i < this.analysisTemplateList.length; i++) {
        templates.push({
          x: Math.round(
            this.analysisTemplateList[i].x - this.image_start_pos_x
          ),
          y: Math.round(
            this.analysisTemplateList[i].y - this.image_start_pos_y
          ),
          h: Math.round(this.analysisTemplateList[i].height),
          w: Math.round(this.analysisTemplateList[i].width),
        });
      }

      var data = {
        uri: this.floorPlanUrl,
        method: "template",
        //template
        template_threshold: 0.05,
        template_list: templates,
        //deeplearning
        colorize: 1,
        postprocess: 0,

        output: "/tmp",
      };
      this.loadingDeepFloorPlane = true;
      this.deepFloorPlanApi
        .analyze(data)
        .then((response) => {
          console.log("response", response);

          this.loadingDeepFloorPlane = false;
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
          this.loadingDeepFloorPlane = false;
        });
    },
    isShowAnalysisToolLearning() {
      if (this.analysisMethod.method == "ml") return true;

      return false;
    },
    isShowAnalysisToolColor() {
      if (this.analysisMethod.method == "color") return true;

      return false;
    },

    isShowAnalysisToolThickness() {
      if (this.analysisMethod.method == "thickness") return true;

      return false;
    },
    isShowAnalysisToolTemplate() {
      if (this.analysisMethod.method == "template") return true;

      return false;
    },
    getMiddlePoint(item) {
      return drawing.getMiddlePoint(item);
    },
    autoAnalyzeRoom() {
      var data = {
        uri: this.floorPlanUrl,
        colorize: 1,
        postprocess: 0,
        output: "/tmp",
      };
      this.loadingDeepFloorPlane = true;
      this.deepFloorPlanApi
        .getnalyzeRoom(data)
        .then((response) => {
          console.log("response", response);
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
          this.loadingDeepFloorPlane = false;
        });
    },
    autoRecognizeRoom() {
      console.log("this.floorPlanUrl", this.floorPlanUrl);
      var data = {
        uri: this.floorPlanUrl,
        colorize: 1,
        postprocess: 0,
        output: "/tmp",
      };
      this.loadingDeepFloorPlane = true;
      this.deepFloorPlanApi
        .getRoomPoints(data)
        .then((response) => {
          console.log("response", response);
          var rooms = response.data.points;
          for (let i = 0; i < rooms.length; i++) {
            var currentRoom = rooms[i];
            currentRoom.x = currentRoom.x + this.image_start_pos_x;
            currentRoom.y = currentRoom.y + this.image_start_pos_y;
            var roomPoints = [];
            roomPoints.push(currentRoom.x, currentRoom.y);
            roomPoints.push(currentRoom.x + currentRoom.w, currentRoom.y);
            roomPoints.push(
              currentRoom.x + currentRoom.w,
              currentRoom.y + currentRoom.h
            );
            roomPoints.push(currentRoom.x, currentRoom.y + currentRoom.h);

            this.stroke = "brown";
            this.rooms.push({
              code: "room" + (this.rooms.length + 1),
              name: "Room " + (this.rooms.length + 1),
              points: roomPoints,
              draggable: true,
              stroke: this.stroke,
              strokeWidth: this.strokeWidth,
              closed: true,
              fill: "rgb(255, 0, 0, 0.3)",
            });
          }
          this.loadingDeepFloorPlane = false;
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
          this.loadingDeepFloorPlane = false;
        });
    },
    autoRecognizeTravelDistance() {
      console.log("autoRecognizeTravelDistance");
      this.prepareGrid(true);

      this.detectObstacle();
      this.recognizeWalls();
      this.recognizeRoomStartPos();
      this.recognizeEndPos();
      this.recognizeAllTravelPath();

      // this.detectRoom();
      // this.recognizeWalls();
      // this.detectDoor();
      // this.clearBlockedDoor();
      // this.recognizeRoomStartPos();
      // this.recognizeEndPos();
      // this.recognizeTravelPathForAllRooms();
    },
    btnPrepareGrid() {
      this.prepareGrid(true);
    },
    btnDetectObstacle() {
      this.detectObstacle();
    },
    btnDetectRoom() {
      this.detectRoom();
    },
    btnRecognizeRoomStartPos() {
      this.recognizeRoomStartPos();
    },
    btnStartSearchForPath() {
      // this.startSearchForPath(true);
      this.recognizeAllTravelPath();
    },
    btnRecognizeEndPos() {
      this.recognizeEndPos();
    },
    btnDetectDoor() {
      this.detectDoor();
    },
    btnRecognizeWall() {
      this.recognizeWalls();
    },
    btnClearBlockDoor() {
      this.clearBlockedDoor();
    },
    recognizeAllTravelPath() {
      console.log("recognizeAllTravelPath");
      var self = this;
      this.startSearchForPath(false);
      for (let a = 0; a < this.travelPathResult.length; a++) {
        var points = [];
        for (let b = 0; b < this.travelPathResult[a].length; b++) {
          var path = this.travelPathResult[a][b];
          for (let k = 0; k < path.length; k++) {
            let i = path[k].y;
            let j = path[k].x;
            points.push(this.cellSize * i, this.cellSize * j);
          }
        }

        this.stroke = "green";
        this.travelDistances.push({
          code: "travelDistance" + (this.travelDistances.length + 1),
          name: "Travel Distance " + (this.travelDistances.length + 1),
          points: points,
          stroke: this.stroke,
          strokeWidth: this.strokeWidth,
          closed: false,
          pointerAtBeginning: true,
          pointerAtEnding: false,
          // lineCap: "round",
          // lineJoin: "round",
          //draggable: true,
        });
      }

      // var self = this;
      // for (let i = 0; i < self.rooms.length; i++) {
      //   var currentRoom = self.rooms[i];
      //   let cellStart = this.getCellFromGrid(
      //     currentRoom.longestPoints[0],
      //     currentRoom.longestPoints[1]
      //   );
      //   var lowestCellCount = [];
      //   var start = {
      //     x: cellStart.j,
      //     y: cellStart.i,
      //   };
      //   for (let j = 0; j < self.endPosList.length; j++) {
      //     var currentEndPos = self.endPosList[j];
      //     var end = {
      //       x: currentEndPos.y,
      //       y: currentEndPos.x,
      //     };
      //     var cellPaths = this.recognizeTravelPath(start, end);
      //     if (lowestCellCount.length == 0) lowestCellCount = cellPaths;
      //     if (cellPaths.length < lowestCellCount.length)
      //       lowestCellCount = cellPaths;
      //   }
      //   if (lowestCellCount.length == 0) continue;
      //   var points = [];
      //   for (let k = 0; k < lowestCellCount.length; k++) {
      //     let i = lowestCellCount[k].y;
      //     let j = lowestCellCount[k].x;
      //     this.grid[i][j] = {
      //       code: "spot_" + i + "_" + j,
      //       name: "spot_" + i + "_" + j,
      //       width: this.cellSize,
      //       height: this.cellSize,
      //       x: this.cellSize * i,
      //       y: this.cellSize * j,
      //       stroke: "black",
      //       strokeWidth: 2,
      //       closed: true,
      //       fill: "rgb(255, 255, 0, 0.3)",
      //     };
      //     points.push(this.cellSize * i, this.cellSize * j);
      //   }

      //   this.stroke = "green";
      //   this.travelDistances.push({
      //     code: "travelDistance" + (this.travelDistances.length + 1),
      //     name: "Travel Distance " + (this.travelDistances.length + 1),
      //     points: points,
      //     stroke: this.stroke,
      //     strokeWidth: this.strokeWidth,
      //     closed: false,
      //     // lineCap: "round",
      //     // lineJoin: "round",
      //     //draggable: true,
      //   });
      // }
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
      let row = Math.round(this.stageSize.width / this.cellSize);
      let col = Math.round(this.stageSize.height / this.cellSize);

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

    recognizeRoomStartPos() {
      console.log("recognizeRoomStartPos");
      var self = this;
      this.startPosList = [];
      for (let k = 0; k < self.rooms.length; k++) {
        var currentRoom = self.rooms[k];
        if (currentRoom.points == null) continue;

        var longestPosition = this.getLongestPosition(currentRoom);
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

    getLongestPosition(currentRoom) {
      var longestDistance = 0;
      var longestPosition = null;
      for (let i = 0; i < currentRoom.roomDoors.length; i++) {
        var currentDoor = currentRoom.roomDoors[i].door;
        var centerDoorX = (currentDoor.points[0] + currentDoor.points[2]) / 2;
        var centerDoorY = (currentDoor.points[1] + currentDoor.points[3]) / 2;

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
    detectRoom() {
      var self = this;
      for (let k = 0; k < self.rooms.length; k++) {
        var currentRoom = self.rooms[k];
        if (currentRoom.points == null) continue;

        for (let i = 0; i < currentRoom.points.length; i = i + 2) {
          var currentPointX = currentRoom.points[i];
          var currentPointY = currentRoom.points[i + 1];

          this.walls.push({
            id: "walls_" + this.walls.length,
            x: currentPointX,
            y: currentPointY,
            stroke: "green",
          });

          if (i + 3 < currentRoom.points.length) {
            var distanceInPixel = drawing.getDistanceInPixel(
              currentRoom.points[i],
              currentRoom.points[i + 1],
              currentRoom.points[i + 2],
              currentRoom.points[i + 3]
            );

            var totalPoint = Math.round(distanceInPixel / this.cellSize);
            totalPoint = totalPoint + 2;
            for (let j = 0; j < totalPoint; j++) {
              var distancePerPointX =
                (currentRoom.points[i + 2] - currentRoom.points[i]) /
                totalPoint;
              var distancePerPointY =
                (currentRoom.points[i + 3] - currentRoom.points[i + 1]) /
                totalPoint;

              var pointX = currentRoom.points[i] + distancePerPointX * (j + 1);
              var pointY =
                currentRoom.points[i + 1] + distancePerPointY * (j + 1);

              this.walls.push({
                id: "walls_" + this.walls.length,
                x: pointX,
                y: pointY,
                stroke: "yellow",
              });
            }
          }
          if (currentRoom.points.length > 4) {
            var distanceInPixel = drawing.getDistanceInPixel(
              currentRoom.points[0],
              currentRoom.points[1],
              currentRoom.points[currentRoom.points.length - 2],
              currentRoom.points[currentRoom.points.length - 1]
            );
            var totalPoint = Math.round(distanceInPixel / this.cellSize);
            totalPoint = totalPoint + 2;

            for (let j = 0; j < totalPoint; j++) {
              var distancePerPointX =
                (currentRoom.points[currentRoom.points.length - 2] -
                  currentRoom.points[0]) /
                totalPoint;
              var distancePerPointY =
                (currentRoom.points[currentRoom.points.length - 1] -
                  currentRoom.points[1]) /
                totalPoint;

              var pointX = currentRoom.points[0] + distancePerPointX * (j + 1);
              var pointY = currentRoom.points[1] + distancePerPointY * (j + 1);

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
    gridClick(item) {
      if (this.pathDrawingType == "start") {
        this.startPosList.push({
          x: item.j,
          y: item.i,
        });

        this.map[item.i][item.j] = 0;
        this.grid[item.i][item.j] = {
          i: item.i,
          j: item.j,
          code: "spot_" + item.i + "_" + item.j,
          name: "spot_" + item.i + "_" + item.j,
          width: this.cellSize,
          height: this.cellSize,
          x: this.cellSize * item.i,
          y: this.cellSize * item.j,
          closed: true,
          fill: "rgb(0, 255, 0)",
        };

        console.log("this.startPosList", this.startPosList);
      } else if (this.pathDrawingType == "end") {
        var i = item.i;
        var j = item.j;

        // this.end = {
        //   x: j,
        //   y: i,
        // };
        this.endPosList.push({
          x: j,
          y: i,
        });

        this.map[i][j] = 0;
        this.grid[i][j] = {
          i: i,
          j: j,
          code: "spot_" + i + "_" + j,
          name: "spot_" + i + "_" + j,
          width: this.cellSize,
          height: this.cellSize,
          x: this.cellSize * i,
          y: this.cellSize * j,
          // stroke: "black",
          // strokeWidth: 1,
          closed: true,
          fill: "rgb(255, 0, 0)",
        };

        console.log("this.endPosList", this.endPosList);
      } else if (this.pathDrawingType == "wall") {
        // let unique = 3213123;
        let i = item.i;
        let j = item.j;

        if (this.map[i][j] == 0) {
          this.map[i][j] = 1;
          this.grid[i][j] = {
            i: i,
            j: j,
            code: "spot_" + i + "_" + j,
            name: "spot_" + i + "_" + j,
            width: this.cellSize,
            height: this.cellSize,
            x: this.cellSize * i,
            y: this.cellSize * j,
            // stroke: "black",
            // strokeWidth: 2,
            closed: true,
            fill: "rgb(40, 40, 40, 0.3)",
            // visited: false,
            // wall: false,
          };
        }

        // else {
        //   this.map[i][j] = 0;
        //   this.grid[i][j] = {
        //     i: i,
        //     j: j,
        //     code: "spot_" + i + "_" + j,
        //     name: "spot_" + i + "_" + j,
        //     width: this.cellSize,
        //     height: this.cellSize,
        //     x: this.cellSize * i,
        //     y: this.cellSize * j,
        //     // stroke: "black",
        //     // strokeWidth: 2,
        //     closed: true,
        //     fill: "rgb(255, 255, 255)",
        //     // visited: false,
        //     // wall: false,
        //   };
        // }
      }
    },
    btnPathStart() {
      this.pathDrawingType = "start";
    },
    btnPathEnd() {
      this.pathDrawingType = "end";
    },
    btnPathWall() {
      this.pathDrawingType = "wall";
    },
    btnTravelDistanceReset() {
      // this.map = [];
      // this.grid = [];
      // this.walls = [];
      //this.detectDoors = [];
      this.cellsProcessed = [];
      this.path = [];
      this.startPosList = [];
      this.endPosList = [];

      for (let a = 0; a < this.travelPathResult.length; a++) {
        for (let b = 0; b < this.travelPathResult[a].length; b++) {
          var path = this.travelPathResult[a][b];
          for (let k = 0; k < path.length; k++) {
            let i = path[k].y;
            let j = path[k].x;
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
              fill: "white",
            };
          }
        }
      }
      //this.prepareGrid();
    },
    prepareGrid(isUpdateColor) {
      console.log("prepareGrid");

      this.cleanPath();
      this.cellSize = 10;
      let row = Math.round(this.stageSize.width / this.cellSize);
      let col = Math.round(this.stageSize.height / this.cellSize);
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
    // btnTestColor() {
    //   //       var found = this.grid[2][2];
    //   //       console.log("found", found);
    //   //       found.fill = "rgb(255, 255, 0, 0.3)";
    //   // this.grid[2][2] = found;
    //   // let spot_width = 32;
    //   // let spot_height = 32;
    //   //let grid = [];
    //   let i = 2;
    //   let j = 2;
    //   // let unique = 12313213;

    //   this.grid[i][j] = {
    //     i: i,
    //     j: j,
    //     code: "spot_" + i + "_" + j,
    //     name: "spot_" + i + "_" + j,
    //     width: this.cellSize,
    //     height: this.cellSize,
    //     x: this.cellSize * i,
    //     y: this.cellSize * j,
    //     stroke: "black",
    //     strokeWidth: 2,
    //     closed: true,
    //     fill: "rgb(255, 255, 0, 0.3)",
    //     // visited: false,
    //     // wall: false,
    //   };

    //   // this.$refs.pathFinderLayer.getStage().show();
    //   this.$refs.pathFinderLayer.getStage().draw();
    //   // this.$refs.pathFinderLayer.getStage().batchDraw();
    //   // _this.$refs.layer.getStage().draw();

    //   // console.log("update", found);
    // },
    startSearchForPath(isUpdateColor) {
      this.processing = true;
      this.travelPathResult = [];
      for (let start = 0; start < this.startPosList.length; start++) {
        this.travelPathResult[start] = [];
        for (let end = 0; end < this.endPosList.length; end++) {
          let generator = new PathGenerator(
            this.startPosList[start],
            this.endPosList[end],
            this.map
          );
          generator.generate();
          this.cellsProcessed = generator.cells;
          this.path = generator.path;
          this.travelPathResult[start][end] = generator.path;

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

    // startPoll() {
    //   // this.isAutoPoll = true;
    // },
    // drawPath() {
    //   alert('asdasd');
    //   console.log(this.grid)
    //   var path = this.calcPath(this.pathFinder.getLastCheckedNode());
    //   for (let i = 0; i < path.length; i++) {
    //     this.grid[path[i].i][path[i].j].fill = "rgb(0, 0, 255, 0.5)";
    //   }
    // },
    // pollSearch() {
    //   this.polling = setInterval(() => {
    //     if (this.isAutoPoll) {
    //       // this.searchStep();

    //       // drawPath(path);
    //     }
    //   }, 10);
    // },
    // calcPath(endNode) {
    //   var path = [];
    //   var temp = endNode;
    //   path.push(temp);
    //   while (temp.previous) {
    //     path.push(temp.previous);
    //     temp = temp.previous;
    //   }
    //   return path;
    // },
    // pauseUnpause(pause) {
    //   this.paused = pause;
    // },
    getCenterOfShape(points) {
      return drawing.getCenterOfShape(points);
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

    // getRoomDiagonalPoints(room) {
    //   var self = this;
    //   if (room.points == null) return;

    //   var point1 = [];
    //   var point2 = [];
    //   var longest = 0;
    //   for (let i = 0; i < room.points.length; i = i + 2) {
    //     var currentPointX = room.points[i];
    //     var currentPointY = room.points[i + 1];

    //     for (let j = 0; j < room.points.length; j = j + 2) {
    //       var otherPointX = room.points[j];
    //       var otherPointY = room.points[j + 1];

    //       if (currentPointX == otherPointX && currentPointY == otherPointY)
    //         continue;

    //       var distance = drawing.getDistanceInPixel(
    //         currentPointX,
    //         currentPointY,
    //         otherPointX,
    //         otherPointY
    //       );
    //       if (distance > longest) {
    //         point1 = [currentPointX, currentPointY];
    //         point2 = [otherPointX, otherPointY];
    //         longest = distance;
    //       }
    //     }
    //   }
    //   return [point1[0], point1[1], point2[0], point2[1]];
    // },
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

      return {
        x: (obj.points[0] + obj.points[2]) / 2,
        y: (obj.points[1] + obj.points[3]) / 2,
      };
    },
    getCoordinateFirst(obj) {
      if (obj.points == null) return "";
      if (obj.points.length < 2) return "";

      return "(" + obj.points[0] + "," + obj.points[1] + ")";
    },
    getCoordinateSecond(obj) {
      if (obj.points == null) return "";
      if (obj.points.length < 4) return "";

      return "(" + obj.points[2] + "," + obj.points[3] + ")";
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
    contextEndDrawingAndContinue() {
      this.handleDone();
      this.drawTypeSelect(this.drawType);
      this.showContextMenu = false;
    },
    contextEndDrawing() {
      this.handleDone();
      this.drawType = "";
      this.showContextMenu = false;
    },
    // closeContextMenu() {
    //   this.contextMenu.show = false;
    //   this.contextMenu.left = 0;
    //   this.contextMenu.top = 0;
    // },
    // openContextMenu() {
    //   let stage = this.$refs.stage.getStage();
    //   // updates position of context menu
    //   this.contextMenu.left = stage.getPointerPosition().x + 4;
    //   this.contextMenu.top = stage.getPointerPosition().y + 4;
    //   //Vue.nextTick(() => this.$el.focus());
    //   this.contextMenu.show = true;
    // },
    // openContextMenu(position) {
    // },
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

      this.$refs.menu.open(position);
    },
    onMouseOut() {
      this.toolTip.visible = false;
    },
    onMouseMoveTravelDistance(item) {
      let stage = this.$refs.stage.getStage();
      var mousePos = stage.getPointerPosition();
      this.toolTip.x = mousePos.x + 5;
      this.toolTip.y = mousePos.y + 5;
      this.toolTip.text = this.getLineDetailInfo(item);
      this.toolTip.visible = true;
    },
    onMouseMove(item) {
      let stage = this.$refs.stage.getStage();
      var mousePos = stage.getPointerPosition();
      this.toolTip.x = mousePos.x + 5;
      this.toolTip.y = mousePos.y + 5;
      this.toolTip.text = item.name;
      this.toolTip.visible = true;
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
    onBuildingCodeSelected(item, index) {
      var self = this;
      self.selectedBuildingCodeCategory = item;
      self.roomSettingObj.buildingCodeId = item.id.toString();
      //self.obj.map = self.mapList[index];

      // self.selectedLocation = {
      //   id: null,
      //   name: "",
      //   code: "",
      // };
      self.buildingCodeCategorySearchPopup = false;
    },

    getLineInfo(item) {
      return item.name;
      var code = item.name;
      var area = this.getDistanceInMeter(item);
      return code + "\n" + area + "m";
    },
    getLineDetailInfo(item) {
      var code = item.name;
      var area = this.getDistanceInMeter(item);
      return code + "\n" + area + "m";
    },
    getRoomInfo(item) {
      var code = item.name;
      var area = this.getPolygonAreaInMeter(item);
      return code + "\n" + area + " m 2";
    },
    roomLabelClick(item) {
      if (this.drawType == "") this.roomSettingClick(item);
    },
    //
    doorLabelClick(item) {
      if (this.drawType == "") this.doorSettingClick(item);
    },
    exitAreaLabelClick(item) {
      if (this.drawType == "") this.exitAreaSettingClick(item);
    },
    exitStairWidthLabelClick(item) {
      if (this.drawType == "") this.exitStairWidthSettingClick(item);
    },

    diagonalDistanceLabelClick(item) {
      if (this.drawType == "") this.diagonalDistanceSettingClick(item);
    },
    commonPathLabelClick(item) {
      if (this.drawType == "") this.commonPathSettingClick(item);
    },
    travelDistanceLabelClick(item) {
      if (this.drawType == "") this.travelDistanceSettingClick(item);
    },
    obstacleLabelClick(item) {
      if (this.drawType == "") this.obstacleSettingClick(item);
    },

    exitSeperationLabelClick(item) {
      if (this.drawType == "") this.exitSeperationSettingClick(item);
    },
    exitDoorLabelClick(item) {
      if (this.drawType == "") this.exitDoorSettingClick(item);
    },
    //
    onSearchBuildingCodeCategory() {
      var self = this;
      self.refreshTableBuildingCodeCategory();
      self.buildingCodeCategorySearchPopup = true;
    },
    onBuildingCodeSelected(item, index) {
      var self = this;
      self.selectedBuildingCodeCategory = item;
      self.roomSettingObj.buildingCodeId = item.id.toString();
      //self.obj.map = self.mapList[index];

      // self.selectedLocation = {
      //   id: null,
      //   name: "",
      //   code: "",
      // };
      self.buildingCodeCategorySearchPopup = false;
    },
    refreshTableBuildingCodeCategory() {
      var self = this;
      self.buildingCodeApi
        .getListByBuildingRuleId(self.obj.buildingRuleId)
        .then((response) => {
          self.buildingCodeCategoryList = response.result;
          console.log('buildingCodeCategoryList',self.buildingCodeCategoryList);
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
          // console.log(data);
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

    onDoorSettingDelete() {
      var self = this;
      this.doorApi
        .delete(self.doorSettingObj.id)
        .then((response) => {
          self.toast("Info", "Delete Success", "success");
          this.$router.go();
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    onDoorSettingConfirmation() {
      var self = this;

      // if (
      //   self.doorSettingObj.doorType == "" ||
      //   self.doorSettingObj.doorType == null
      // )
      //   self.doorSettingObj.doorType = "Swing In";

      this.doorApi
        .update(self.doorSettingObj)
        .then((response) => {
          self.toast("Info", "Update Success", "success");
          this.$router.go();
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },

    onExitDoorSettingDelete() {
      var self = this;
      this.exitStairDoorApi
        .delete(self.exitDoorSettingObj.id)
        .then((response) => {
          self.toast("Info", "Delete Success", "success");
          this.$router.go();
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    onExitDoorSettingConfirmation() {
      var self = this;

      this.exitStairDoorApi
        .update(self.exitDoorSettingObj)
        .then((response) => {
          self.toast("Info", "Update Success", "success");
          this.$router.go();
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },

    onExitSeperationSettingDelete() {
      var self = this;
      this.exitSeperationApi
        .delete(self.exitSeperationSettingObj.id)
        .then((response) => {
          self.toast("Info", "Delete Success", "success");
          this.$router.go();
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    onExitSeperationSettingConfirmation() {
      var self = this;

      this.exitSeperationApi
        .update(self.exitSeperationSettingObj)
        .then((response) => {
          self.toast("Info", "Update Success", "success");
          this.$router.go();
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },

    onExitAreaSettingDelete() {
      var self = this;

      this.exitAreaApi
        .delete(self.exitAreaSettingObj.id)
        .then((response) => {
          self.toast("Info", "Delete Success", "success");
          this.$router.go();
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    onExitAreaSettingConfirmation() {
      var self = this;
      this.exitAreaApi
        .update(self.exitAreaSettingObj)
        .then((response) => {
          self.toast("Info", "Update Success", "success");
          this.$router.go();
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },

    onExitStairWidthSettingDelete() {
      var self = this;
      this.exitStairWidthApi
        .delete(self.exitStairWidthSettingObj.id)
        .then((response) => {
          self.toast("Info", "Delete Success", "success");
          this.$router.go();
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    onExitStairWidthSettingConfirmation() {
      var self = this;
      this.exitStairWidthApi
        .update(self.exitStairWidthSettingObj)
        .then((response) => {
          self.toast("Info", "Update Success", "success");
          this.$router.go();
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },

    //
    onDiagonalDistanceSettingDelete() {
      var self = this;
      this.diagonalDistanceApi
        .delete(self.diagonalDistanceSettingObj.id)
        .then((response) => {
          self.toast("Info", "Delete Success", "success");
          this.$router.go();
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    onDiagonalDistanceSettingConfirmation() {
      var self = this;

      this.diagonalDistanceApi
        .update(self.diagonalDistanceSettingObj)
        .then((response) => {
          self.toast("Info", "Update Success", "success");
          this.$router.go();
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },

    onCommonPathSettingDelete() {
      var self = this;
      this.commonPathApi
        .delete(self.commonPathSettingObj.id)
        .then((response) => {
          self.toast("Info", "Delete Success", "success");
          this.$router.go();
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    onCommonPathSettingConfirmation() {
      var self = this;

      this.commonPathApi
        .update(self.commonPathSettingObj)
        .then((response) => {
          self.toast("Info", "Update Success", "success");
          this.$router.go();
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    onTravelDistanceSettingDelete() {
      var self = this;
      this.travelDistanceApi
        .delete(self.travelDistanceSettingObj.id)
        .then((response) => {
          self.toast("Info", "Delete Success", "success");
          this.$router.go();
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    onTravelDistanceSettingConfirmation() {
      var self = this;

      this.travelDistanceApi
        .update(self.travelDistanceSettingObj)
        .then((response) => {
          self.toast("Info", "Update Success", "success");
          this.$router.go();
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
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

    //
    onFloorPlanConfirmation() {
      this.onSubmit();
      this.workSettingPopup = false;
    },
    onFloorPlanDelete() {},

    onSubmit() {
      //evt.preventDefault();
      var self = this;

      if (self.uploadedFiles.length > 0)
        self.obj.documentId = self.uploadedFiles[0].id;
      self.obj.buildingRuleId = self.buildingRuleId;
      self.obj.mainClassificationId = self.mainClassificationId;

      for (let i = 0; i < self.obj.rooms.length; i++) {
        if (self.obj.rooms[i].minimumNumberOfExitId == "")
          self.obj.rooms[i].minimumNumberOfExitId = null;

        if (self.obj.rooms[i].occupantLoadFactorId == "")
          self.obj.rooms[i].occupantLoadFactorId = null;
      }
      this.api
        .update(self.obj)
        .then((response) => {
          self.toast("Error", "Update Success", "success");
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    toast(header, message, color) {
      var self = this;
      self.infoList.push({
        header: header,
        message: message,
        color: color,
      });
    },
    onDrawScaleCompleted() {
      // this.newCategory = {
      //   serviceProviderId: this.obj.id,
      //   name: "",
      // };
      var self = this;
      // if (self.obj.scale.lengthInMeter == null) {
      //   self.obj.scale.lengthInMeter = 0;
      // }

      //self.newScale = self.obj.scale.lengthInMeter;
      self.scaleSettingPopup = true;
    },
    onWorkSettingConfirmation(status, evt, accept) {
      var self = this;
      if (accept) {
        // self.obj.scale.lengthInMeter = parseInt(self.newScale);
      }
    },
    uploaded(data) {
      this.uploadedFiles = data.uploadedFiles;
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
    scaleClick() {
      this.drawTypeSelect("scale");
    },
    roomClick() {
      this.drawTypeSelect("room");
    },
    roomRectClick() {
      this.drawTypeSelect("roomRect");
    },
    updateCursor(cursor) {
      let stage = this.$refs.stage.getStage();
      stage.container().style.cursor = cursor;
    },
    stairWidthClick() {
      this.drawTypeSelect("exitStairWidth");
    },
    exitSeperationClick() {
      this.drawTypeSelect("exitSeparation");
    },
    diagonalDistanceClick() {
      this.drawTypeSelect("diagonalDistance");
    },
    travelDistanceClick() {
      this.drawTypeSelect("travelDistance");
    },
    travelDistanceAutoClick() {
      this.autoRecognizeTravelDistance();
    },
    roomAutoClick() {
      this.autoRecognizeRoom();
    },
    analyzeClick(data) {
      this.drawTypeSelect("");
      this.analysisMethod = data;
      if (this.analysisMethod.method == "color") {
        this.zoomReset();
      }
      //this.roomAnalysisMethod();
    },
    commonPathClick() {
      this.drawTypeSelect("commonPath");
    },
    obstacleClick() {
      this.drawTypeSelect("obstacle");
    },
    doorClick() {
      this.drawTypeSelect("doors");
    },
    doorVerticalClick() {
      this.drawTypeSelect("doorVertical");
    },
    doorHorizontalClick() {
      this.drawTypeSelect("doorHorizontal");
    },

    stairClick() {
      this.drawTypeSelect("stairExit");
    },
    exitDoorClick() {
      this.drawTypeSelect("exitDoor");
    },
    // getPolygonAreaInMeter(item) {
    //   var areaInPixel = this.getPolygonArea(item);
    //   return areaInPixel * this.obj.scale.distanceInMeterForOnePixel;
    // },
    getPolygonAreaInMeter(item) {
      var areaInPixel = this.getPolygonArea(item);
      var areaInMeter =
        areaInPixel *
        this.obj.scale.distanceInMeterForOnePixel *
        this.obj.scale.distanceInMeterForOnePixel;
      areaInMeter = Math.round(areaInMeter * 1000) / 1000;

      return areaInMeter;
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
    //https://www.geeksforgeeks.org/area-of-a-polygon-with-given-n-ordered-vertices/
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
    // getDistanceInMeter(item) {
    //   var distanceInPixel = this.getDistance(item);
    //   return distanceInPixel * this.obj.scale.distanceInMeterForOnePixel;
    // },
    getDistanceInMeter(item) {
      var distanceInPixel = this.getDistance(item);
      var distainceInMeter =
        distanceInPixel * this.obj.scale.distanceInMeterForOnePixel;
      distainceInMeter = Math.round(distainceInMeter * 1000) / 1000;

      return distainceInMeter;
    },

    getDistanceForOnePixel(item) {
      var distanceInPixel = this.getDistance(item);
      var distanceInMeter = item.lengthInMeter;
      var distanceInMeterForOnePixel = distanceInMeter / distanceInPixel;
      this.obj.scale.distanceInMeterForOnePixel = distanceInMeterForOnePixel;
      return this.obj.scale.distanceInMeterForOnePixel;
    },
    getDistance(item) {
      try {
        // var points = item.points;

        return drawing.getDistanceFromPoints(item.points);
      } catch (error) {}
      return 0;
    },
    drawTypeSelect(draw) {
      this.drawType = draw;
      this.drawingState = "";

      this.analysisMethod = {
        category: "",
        method: "",
      };
      if (this.drawType === "line") {
        this.stroke = "black";
      }
      if (this.drawType === "scale") {
        this.stroke = "black";
        //exitStairWidth
      } else if (this.drawType === "exitStairWidth") {
        this.updateCursor("crosshair");
        this.stroke = "black";
      } else if (this.drawType === "exitSeparation") {
        this.updateCursor("crosshair");
        this.stroke = "red";
      } else if (this.drawType === "polygon") {
        this.updateCursor("crosshair");
        this.stroke = "pink";
      } else if (this.drawType === "diagonalDistance") {
        this.updateCursor("crosshair");
        this.stroke = "green";
      } else if (this.drawType === "travelDistance") {
        this.updateCursor("crosshair");
        this.stroke = "blue";
      } else if (this.drawType === "commonPath") {
        this.updateCursor("crosshair");
        this.stroke = "purple";
      } else if (this.drawType === "room") {
        this.updateCursor("crosshair");
        this.stroke = "brown";
      } else if (this.drawType === "roomRect") {
        this.updateCursor("crosshair");
        this.stroke = "brown";
      } else if (this.drawType === "stairExit") {
        this.updateCursor("crosshair");
        this.stroke = "yellow";
      } else if (this.drawType === "obstacle") {
        this.updateCursor("crosshair");
        this.stroke = "orange";
      } else if (this.drawType === "doors") {
        this.updateCursor("crosshair");
        this.stroke = "red";
      } else if (this.drawType === "doorVertical") {
        this.updateCursor("crosshair");
        this.stroke = "red";
      } else if (this.drawType === "doorHorizontal") {
        this.updateCursor("crosshair");
        this.stroke = "red";
      } else if (this.drawType === "exitDoor") {
        this.updateCursor("crosshair");
        this.stroke = "pink";
      } else if (this.drawType === "analysis_template") {
        this.updateCursor("crosshair");
        this.stroke = "red";
      }
    },
    handleGroupTransform(e) {},
    handleDone() {
      this.drawingState = "end";
      if (this.drawType === "polygon") {
        this.handleDrawPolygon();
      } else if (this.drawType === "travelDistance") {
        this.handleDrawTravelDistance();
      } else if (this.drawType === "commonPath") {
        this.handleDrawCommonPath();
      } else if (this.drawType === "room") {
        this.handleDrawRoom();
      } else if (this.drawType === "stairExit") {
        this.handleDrawStairExit();
      } else if (this.drawType === "obstacle") {
        this.handleDrawObstacle();
      } else if (this.drawType === "doors") {
        this.handleDrawDoor();
      } else if (this.drawType === "exitDoor") {
        this.drawingState = "";
        //this.handleDrawDoorExit();
      }
      this.updateCursor("default");
    },
    handleStageMouseClick(event) {
      if (event.evt.button == 2) {
        //right click
        // this.handleDone();
        // this.drawType = "";
      } else {
        if (this.drawType === "line") {
          this.handleDrawLine();
        } else if (this.drawType === "scale") {
          this.handleDrawScale();
        } else if (this.drawType === "exitStairWidth") {
          this.handleDrawExitStairWidth();
        } else if (this.drawType === "exitSeparation") {
          this.handleDrawExitSeperation();
        } else if (this.drawType === "polygon") {
          this.handleDrawPolygon();
        } else if (this.drawType === "diagonalDistance") {
          this.handleDrawDiagonalDistance();
        } else if (this.drawType === "travelDistance") {
          this.handleDrawTravelDistance();
        } else if (this.drawType === "commonPath") {
          this.handleDrawCommonPath();
        } else if (this.drawType === "room") {
          this.handleDrawRoom();
        } else if (this.drawType === "roomRect") {
          this.handleDrawRoomRect();
        } else if (this.drawType === "stairExit") {
          this.handleDrawStairExit();
        } else if (this.drawType === "obstacle") {
          this.handleDrawObstacle();
        } else if (this.drawType === "doors") {
          this.handleDrawDoor();
        } else if (this.drawType === "doorVertical") {
          this.handleDrawDoorVertical();
        } else if (this.drawType === "doorHorizontal") {
          this.handleDrawDoorHorizontal();
          
          } else if (this.drawType === "exitDoor") {
          this.handleDrawDoorExit();
        }
      }
    },
    handleClickOnPolygonNode(event) {
      const id = event.target.id();
      const item = this.anchors.find((i) => i.id === id);
      const index = this.anchors.indexOf(item);

      if (index === 0) {
        this.closed = true;
        this.isPolygonFinished = true;
        this.anchors[this.anchors.length - 1].stroke = "black";
      }
    },
    handleDrawPolygon() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });
        this.mouseClickPoint.push({
          x: x,
          y: y,
        });

        this.polygons.push({
          code: "polygon" + (this.polygons.length + 1),
          name: "Polygon " + (this.polygons.length + 1),
          points: [x, y],
          stroke: this.stroke,
          strokeWidth: this.strokeWidth,
          closed: true,
          fill: "rgb(58, 141, 243, 0.3)",
        });
        this.drawingState = "progress";
      } else if (this.drawingState === "progress") {
        if (this.anchors.length > 0) {
          this.anchors[this.anchors.length - 1].stroke = "black";
        }
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });

        this.polygons[this.polygons.length - 1].points.push(x, y);
      } else if (this.drawingState == "end") {
        this.anchors = [];
        this.mouseClickPoint = [];
        this.drawingState = "";
        this.handleSaveHistory();
      }
    },
    handleDrawStairExit() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });
        this.mouseClickPoint.push({
          x: x,
          y: y,
        });

        this.exitStairAreas.push({
          code: "stairExit" + (this.exitStairAreas.length + 1),
          name: "Exit " + (this.exitStairAreas.length + 1),
          points: [x, y],
          stroke: this.stroke,
          strokeWidth: this.strokeWidth,
          closed: true,
          fill: "rgb(58, 141, 243, 0.3)",
        });
        this.drawingState = "progress";
      } else if (this.drawingState === "progress") {
        if (this.anchors.length > 0) {
          this.anchors[this.anchors.length - 1].stroke = "black";
        }
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });

        this.exitStairAreas[this.exitStairAreas.length - 1].points.push(x, y);
      } else if (this.drawingState == "end") {
        this.anchors = [];
        this.mouseClickPoint = [];
        this.drawingState = "";
        this.handleSaveHistory();
      }
    },

    handleDrawDoor() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });
        this.mouseClickPoint.push({
          x: x,
          y: y,
        });

        this.doors.push({
          code: "door" + (this.doors.length + 1),
          name: "Door " + (this.doors.length + 1),
          doorType: "Swing In",
          points: [x, y],
          stroke: this.stroke,
          strokeWidth: this.strokeWidth,
          closed: true,
          fill: "rgb(58, 141, 243, 0.3)",
        });
        this.drawingState = "progress";
      } else if (this.drawingState === "progress") {
        if (this.anchors.length > 0) {
          this.anchors[this.anchors.length - 1].stroke = "black";
        }
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });

        this.doors[this.doors.length - 1].points.push(x, y);
      } else if (this.drawingState == "end") {
        this.anchors = [];
        this.mouseClickPoint = [];
        this.drawingState = "";
        this.handleSaveHistory();
      }
    },

    handleDrawDoorVertical() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      var distanceToAdd = 20;
      if (this.drawingState === "") {
        this.doors.push({
          code: "door" + (this.doors.length + 1),
          name: "Door " + (this.doors.length + 1),
          doorType: "Swing In",
          points: [x, y, x, y+distanceToAdd],
          stroke: this.stroke,
          strokeWidth: this.strokeWidth,
          closed: true,
          fill: "rgb(58, 141, 243, 0.3)",
        });
      
        this.anchors = [];
        this.mouseClickPoint = [];
        this.drawingState = "";
        this.handleSaveHistory();

      } 
    },
     handleDrawDoorHorizontal() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      var distanceToAdd = 20;
      if (this.drawingState === "") {
        this.doors.push({
          code: "door" + (this.doors.length + 1),
          name: "Door " + (this.doors.length + 1),
          doorType: "Swing In",
          points: [x, y, x+distanceToAdd, y],
          stroke: this.stroke,
          strokeWidth: this.strokeWidth,
          closed: true,
          fill: "rgb(58, 141, 243, 0.3)",
        });
      
        this.anchors = [];
        this.mouseClickPoint = [];
        this.drawingState = "";
        this.handleSaveHistory();

      } 
    },
    handleDrawObstacle() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });
        this.mouseClickPoint.push({
          x: x,
          y: y,
        });

        this.obstacles.push({
          code: "obstacle" + (this.obstacles.length + 1),
          name: "Obstacle " + (this.obstacles.length + 1),
          points: [x, y],
          stroke: this.stroke,
          strokeWidth: this.strokeWidth,
          closed: true,
          fill: "rgb(58, 141, 243, 0.3)",
        });
        this.drawingState = "progress";
      } else if (this.drawingState === "progress") {
        if (this.anchors.length > 0) {
          this.anchors[this.anchors.length - 1].stroke = "black";
        }
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });

        this.obstacles[this.obstacles.length - 1].points.push(x, y);
      } else if (this.drawingState == "end") {
        this.anchors = [];
        this.mouseClickPoint = [];
        this.drawingState = "";
        this.handleSaveHistory();
      }
    },
    // handleDrawAnalysisTemplate() {
    //   const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
    //   const x = mousePos.x;
    //   const y = mousePos.y;
    //   if (this.drawingState === "") {
    //     this.anchors.push({
    //       id: Math.round(Math.random() * 10000).toString(),
    //       x: x,
    //       y: y,
    //       stroke: "green",
    //     });
    //     this.mouseClickPoint.push({
    //       x: x,
    //       y: y,
    //     });

    //     //reset for if it reach the maximum template
    //     if (this.analysisTemplateList.length > 2)
    //       this.analysisTemplateList = [];

    //     this.analysisTemplateList.push({
    //       code: "analysisTemplateList" + (this.analysisTemplateList.length + 1),
    //       name:
    //         "analysisTemplateList " + (this.analysisTemplateList.length + 1),
    //       points: [x, y],
    //       stroke: this.stroke,
    //       strokeWidth: this.strokeWidth,
    //       closed: true,
    //       fill: "rgb(58, 141, 243, 0.3)",
    //     });
    //     this.drawingState = "progress";
    //   } else if (this.drawingState === "progress") {
    //     if (this.anchors.length > 0) {
    //       this.anchors[this.anchors.length - 1].stroke = "black";
    //     }
    //     this.anchors.push({
    //       id: Math.round(Math.random() * 10000).toString(),
    //       x: x,
    //       y: y,
    //       stroke: "green",
    //     });

    //     //add new point
    //     this.this.analysisTemplateList[
    //       this.this.analysisTemplateList.length - 1
    //     ].points.push(x, y);
    //   } else if (this.drawingState == "end") {
    //     this.anchors = [];
    //     this.mouseClickPoint = [];
    //     this.drawingState = "";
    //     this.handleSaveHistory();
    //   }
    // },
    handleDrawRoom() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });
        this.mouseClickPoint.push({
          x: x,
          y: y,
        });

        this.rooms.push({
          code: "room" + (this.rooms.length + 1),
          name: "Room " + (this.rooms.length + 1),
          points: [x, y],
          draggable: true,
          stroke: this.stroke,
          strokeWidth: this.strokeWidth,
          closed: true,
          fill: "rgb(255, 0, 0, 0.3)",
        });
        this.drawingState = "progress";
      } else if (this.drawingState === "progress") {
        if (this.anchors.length > 0) {
          this.anchors[this.anchors.length - 1].stroke = "black";
        }
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });

        this.rooms[this.rooms.length - 1].points.push(x, y);
      } else if (this.drawingState == "end") {
        this.anchors = [];
        this.mouseClickPoint = [];
        this.drawingState = "";
        this.handleSaveHistory();
      }
    },

    handleDrawRoomRect() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });
        this.mouseClickPoint.push({
          x: x,
          y: y,
        });

        this.rooms.push({
          code: "room" + (this.rooms.length + 1),
          name: "Room " + (this.rooms.length + 1),
          points: [x, y],
          draggable: true,
          stroke: this.stroke,
          strokeWidth: this.strokeWidth,
          closed: true,
          fill: "rgb(255, 0, 0, 0.3)",
        });
        this.drawingState = "end";
      // } else if (this.drawingState === "progress") {
      //   if (this.anchors.length > 0) {
      //     this.anchors[this.anchors.length - 1].stroke = "black";
      //   }
      //   this.anchors.push({
      //     id: Math.round(Math.random() * 10000).toString(),
      //     x: x,
      //     y: y,
      //     stroke: "green",
      //   });

      //   this.rooms[this.rooms.length - 1].points.push(x, y);
      } else if (this.drawingState == "end") {
        if (this.anchors.length > 0) {
          this.anchors[this.anchors.length - 1].stroke = "black";
        }
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });

        var startX = this.rooms[this.rooms.length - 1].points[0];
        var startY = this.rooms[this.rooms.length - 1].points[1];

        this.rooms[this.rooms.length - 1].points.push(startX, y);
        this.rooms[this.rooms.length - 1].points.push(x, y);
        this.rooms[this.rooms.length - 1].points.push(x, startY);

        this.anchors = [];
        this.mouseClickPoint = [];
        this.drawingState = "";
        this.handleSaveHistory();
      }
    },

    handleDrawCommonPath() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "purple",
        });
        this.mouseClickPoint.push({
          x: x,
          y: y,
        });
        this.commonPaths.push({
          code: "commonPath" + (this.commonPaths.length + 1),
          name: "Common " + (this.commonPaths.length + 1),
          points: [x, y],
          stroke: this.stroke,
          strokeWidth: this.strokeWidth,
          closed: false,
          // lineCap: "round",
          // lineJoin: "round",
          //draggable: true,
        });

        this.drawingState = "progress";
      } else if (this.drawingState === "progress") {
        if (this.anchors.length > 0) {
          this.anchors[this.anchors.length - 1].stroke = "black";
        }
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });

        this.commonPaths[this.commonPaths.length - 1].points.push(x, y);
        this.handleSaveHistory();
      } else if (this.drawingState === "end") {
        this.anchors = [];
        this.mouseClickPoint = [];
        this.drawingState = "";
        this.handleSaveHistory();
      }
    },

    handleDrawTravelDistance() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });
        this.mouseClickPoint.push({
          x: x,
          y: y,
        });
        this.travelDistances.push({
          code: "travelDistance" + (this.travelDistances.length + 1),
          name: "Travel Distance " + (this.travelDistances.length + 1),
          points: [x, y],
          stroke: this.stroke,
          strokeWidth: this.strokeWidth,
          closed: false,
          // lineCap: "round",
          // lineJoin: "round",
          //draggable: true,
        });

        this.drawingState = "progress";
      } else if (this.drawingState === "progress") {
        if (this.anchors.length > 0) {
          this.anchors[this.anchors.length - 1].stroke = "black";
        }
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });

        this.travelDistances[this.travelDistances.length - 1].points.push(x, y);
        this.handleSaveHistory();
      } else if (this.drawingState === "end") {
        this.anchors = [];
        this.mouseClickPoint = [];
        this.drawingState = "";
        this.handleSaveHistory();
      }
    },

    handleDrawDiagonalDistance() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });
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
        if (this.anchors.length > 0) {
          this.anchors[this.anchors.length - 1].stroke = "black";
        }
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });

        this.diagonalDistances[this.diagonalDistances.length - 1].points = [
          this.mouseClickPoint[0].x,
          this.mouseClickPoint[0].y,
          x,
          y,
        ];

        this.anchors = [];
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
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });
        this.mouseClickPoint.push({
          x: x,
          y: y,
        });
        this.exitStairWidths.push({
          code: "exitStairWidth" + (this.exitStairWidths.length + 1),
          name: "Stair " + (this.exitStairWidths.length + 1),
          points: [x, y],
          stroke: this.stroke,
          strokeWidth: this.strokeWidth,
          lineCap: "round",
          lineJoin: "round",
          //draggable: true,
        });

        this.drawingState = "end";
      } else if (this.drawingState === "end") {
        if (this.anchors.length > 0) {
          this.anchors[this.anchors.length - 1].stroke = "black";
        }
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });

        this.exitStairWidths[this.exitStairWidths.length - 1].points = [
          this.mouseClickPoint[0].x,
          this.mouseClickPoint[0].y,
          x,
          y,
        ];

        this.anchors = [];
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
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });
        this.mouseClickPoint.push({
          x: x,
          y: y,
        });
        this.exitStairDoors.push({
          code: "exitStairDoors" + (this.exitStairDoors.length + 1),
          name: "Door " + (this.exitStairDoors.length + 1),
          points: [x, y],
          stroke: this.stroke,
          strokeWidth: this.strokeWidth,
          lineCap: "round",
          lineJoin: "round",
        });

        this.drawingState = "end";
      } else if (this.drawingState === "end") {
        if (this.anchors.length > 0) {
          this.anchors[this.anchors.length - 1].stroke = "black";
        }
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });

        this.exitStairDoors[this.exitStairDoors.length - 1].points = [
          this.mouseClickPoint[0].x,
          this.mouseClickPoint[0].y,
          x,
          y,
        ];

        this.anchors = [];
        this.mouseClickPoint = [];
        this.drawingState = "";
        this.handleSaveHistory();

        //recalculate the exit seperation
        this.autoDrawExitSeperation();
      }
    },
    showRoomDiagonalDistance() {
      this.roomDiagonalDistances = [];
      for (let i = 0; i < this.rooms.length; i++) {
        try {
          var diagonalPoints = drawing.getRoomDiagonalPoints(this.rooms[i]);

          this.roomDiagonalDistances.push({
            code:
              "roomDiagonalDistances" + (this.roomDiagonalDistances.length + 1),
            name: "Diagonal " + +(this.roomDiagonalDistances.length + 1),
            points: [
              diagonalPoints[0],
              diagonalPoints[1],
              diagonalPoints[2],
              diagonalPoints[3],
            ],
            stroke: "blue",
            strokeWidth: this.strokeWidth,
            lineCap: "round",
            lineJoin: "round",
          });
        } catch (error) {}
      }
    },
    autoDrawDiagonalDistance() {
      var self = this;

      var points = this.getFloorDiagonalPoints();
      if (points[0] == null) return;

      var point1 = [points[0], points[1]];
      var point2 = [points[2], points[3]];

      this.diagonalDistances = [];
      this.stroke = "yellow";
      this.diagonalDistances.push({
        code: "diagonalDistances" + (this.diagonalDistances.length + 1),
        name: "Diagonal Distances " + (this.diagonalDistances.length + 1),
        points: [point1[0], point1[1], point2[0], point2[1]],
        stroke: this.stroke,
        strokeWidth: this.strokeWidth,
        lineCap: "round",
        lineJoin: "round",
      });
    },
    autoDrawExitSeperation() {
      var self = this;
      if (this.exitStairDoors.length < 2) {
        self.exitSeperations = [];
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

      this.stroke = "black";
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
          stroke: this.stroke,
          strokeWidth: this.strokeWidth,
          lineCap: "round",
          lineJoin: "round",
        });
      }

      // return exitDistanceList;

      // for (let i = 0; i < this.exitStairDoors.length; i++) {
      //   for (let j = 0; j < this.exitStairDoors.length; j++) {}
      // }
    },
    handleDrawExitSeperation() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });
        this.mouseClickPoint.push({
          x: x,
          y: y,
        });
        this.exitSeperations.push({
          code: "exitSeparation" + (this.exitSeperations.length + 1),
          name: "Separation " + (this.exitSeperations.length + 1),
          points: [x, y],
          stroke: this.stroke,
          strokeWidth: this.strokeWidth,
          lineCap: "round",
          lineJoin: "round",
          //draggable: true,
        });

        this.drawingState = "end";
      } else if (this.drawingState === "end") {
        if (this.anchors.length > 0) {
          this.anchors[this.anchors.length - 1].stroke = "black";
        }
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });

        this.exitSeperations[this.exitSeperations.length - 1].points = [
          this.mouseClickPoint[0].x,
          this.mouseClickPoint[0].y,
          x,
          y,
        ];

        this.anchors = [];
        this.mouseClickPoint = [];
        this.drawingState = "";
        this.handleSaveHistory();
      }
    },
    handleDrawScale() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });
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
        // this.scales.push({
        //   code: "scale" + this.scales.length,
        //   points: [x, y],
        //   stroke: this.stroke,
        //   strokeWidth: this.strokeWidth,
        //   lineCap: "round",
        //   lineJoin: "round",
        //   draggable: true,
        // });

        this.drawingState = "end";
      } else if (this.drawingState === "end") {
        if (this.anchors.length > 0) {
          this.anchors[this.anchors.length - 1].stroke = "black";
        }
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });

        this.obj.scale.points = [
          this.mouseClickPoint[0].x,
          this.mouseClickPoint[0].y,
          x,
          y,
        ];
        // this.scales[this.scales.length - 1].points = [
        //   this.mouseClickPoint[0].x,
        //   this.mouseClickPoint[0].y,
        //   x,
        //   y,
        // ];

        this.anchors = [];
        this.mouseClickPoint = [];
        this.drawingState = "";
        this.onDrawScaleCompleted();
        //this.handleSaveHistory();
      }
    },
    handleDrawLine() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });
        this.mouseClickPoint.push({
          x: x,
          y: y,
        });

        this.lines.push({
          code: "line" + (this.lines.length + 1),
          name: "Line " + (this.lines.length + 1),
          points: [x, y],
          stroke: this.stroke,
          strokeWidth: this.strokeWidth,
          lineCap: "round",
          lineJoin: "round",
          //draggable: true,
        });

        this.drawingState = "end";
      } else if (this.drawingState === "end") {
        if (this.anchors.length > 0) {
          this.anchors[this.anchors.length - 1].stroke = "black";
        }
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });

        this.lines[this.lines.length - 1].points = [
          this.mouseClickPoint[0].x,
          this.mouseClickPoint[0].y,
          x,
          y,
        ];

        this.anchors = [];
        this.mouseClickPoint = [];
        this.drawingState = "";
        this.handleSaveHistory();
      }
    },
    clear(event) {
      this.closed = false;
      this.isPolygonFinished = false;

      this.points = [];
      this.anchors = [];
    },
    // handleMouseMove(event) {
    //   const point = this.$refs.stage.getNode().getPointerPosition();
    //   this.point_x = point.x;
    //   this.point_y = point.y;
    //   this.point_text = "x: " + point.x + ", y: " + point.y;
    // },
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

    handleSaveHistory() {
      this.step += 1;
      this.stageHistory = [
        ...this.stageHistory,
        {
          lines: [...this.lines],
          //scales: [...this.scales],
          polygons: [...this.polygons],
          // rooms: [...this.rooms],
          obstacles: [...this.obstacles],
          doors: [...this.doors],
          texts: [...this.texts],
          exitSeperations: [...this.exitSeperations],
          exitStairWidths: [...this.exitStairWidths],
          diagonalDistances: [...this.diagonalDistances],
          travelDistances: [...this.travelDistances],
          commonPaths: [...this.commonPaths],
          exitStairAreas: [...this.exitStairAreas],
          exitStairDoors: [...this.exitStairDoors],
        },
      ];
    },
    handlePrevStep() {
      if (this.step == 0) {
        return;
      } else {
        this.step = this.step - 1;
        let _cur = this.stageHistory[this.step];
        const {
          lines,
          scales,
          polygons,
          commonPaths,
          rooms,
          obstacles,
          doors,
          texts,
          exitSeperations,
          exitStairWidths,
          diagonalDistances,
          travelDistances,
          exitStairAreas,
          exitStairDoors,
        } = _cur;
        this.lines = [...lines];
        this.scales = [...scales];
        this.polygons = [...polygons];
        this.rooms = [...rooms];
        this.obstacles = [...obstacles];
        this.doors = [...doors];
        this.commonPaths = [...commonPaths];
        // this.shapes = [...shapes];
        this.texts = [...texts];
        this.exitSeperations = [...exitSeperations];
        this.exitStairWidths = [...exitStairWidths];
        this.diagonalDistances = [...diagonalDistances];
        this.travelDistances = [...travelDistances];
        this.exitStairAreas = [...exitStairAreas];
        this.exitStairDoors = [...exitStairDoors];
      }
    },
    handleNextStep() {
      if (this.step == this.stageHistory.length - 1) {
        return;
      } else {
        this.step = this.step + 1;
        let _cur = this.stageHistory[this.step];
        const {
          lines,
          scales,
          polygons,
          commonPaths,
          rooms,
          doors,
          obstacles,
          texts,
          exitStairWidths,
          exitSeperations,
          diagonalDistances,
          travelDistances,
          exitStairAreas,
          exitStairDoors,
        } = _cur;
        this.lines = [...lines];
        this.scales = [...scales];
        this.polygons = [...polygons];
        this.commonPaths = [...commonPaths];
        this.doors = [...doors];
        this.obstacles = [...obstacles];
        this.rooms = [...rooms];
        this.texts = [...texts];
        this.exitStairWidths = [...exitStairWidths];
        this.exitSeperations = [...exitSeperations];
        this.diagonalDistances = [...diagonalDistances];
        this.travelDistances = [...travelDistances];
        this.exitStairAreas = [...exitStairAreas];
        this.exitStairDoors = [...exitStairDoors];
      }
    },
    // initBg() {
    //   const image = new window.Image();
    //   image.crossOrigin = "anonymous";
    //   image.src = "http://image.cqfee.top/a.jpg";
    //   // image.src='http://image.cqfee.top/123.png'
    //   image.onload = () => {
    //     // set image only when it is loaded
    //     let _w = this.$refs.stage.getStage().width(); // stage宽
    //     let _h = (image.height * _w) / image.width; // stage高是图片等比例放大的高
    //     this.stageSize.height = _h;
    //     this.imageConfig.width = _w;
    //     this.imageConfig.height = _h;
    //     this.imageConfig.image = image;
    //   };
    // },
    handleClear() {
      this.lines = this.polygons = this.texts = [];
      this.exitSeperations = [];
      this.exitStairWidths = [];
      this.diagonalDistances = [];
      this.travelDistances = [];
      this.commonPaths = [];
      this.rooms = [];
      this.doors = [];
      this.obstacles = [];
      this.exitStairAreas = [];
      this.scales = [];
      this.exitStairDoors = [];
      // this.init();
    },
    // handleRotate() {
    //   this.rotated++;
    //   let _rotation = (this.rotated % 4) * 90;

    //   const image = new window.Image();
    //   image.crossOrigin = "anonymous";
    //   image.src = "http://image.cqfee.top/a.jpg";
    //   // image.src='http://image.cqfee.top/123.png'
    //   image.onload = () => {
    //     // set image only when it is loaded
    //     let w = image.width;
    //     let h = image.height;
    //     if (_rotation == 90 || _rotation == 270) {
    //       this.imageConfig.image = image;

    //       let _w = this.$refs.stage.getStage().attrs.width; // stage宽
    //       this.imageConfig.width = (_w * w) / h;
    //       this.imageConfig.height = _w;

    //       let _h = (w * _w) / h; // stage高是图片等比例放大的高

    //       this.stageSize.width = _w;
    //       this.stageSize.height = _h;

    //       this.imageConfig = {
    //         ...this.imageConfig,
    //         x: this.stageSize.width / 2,
    //         y: this.stageSize.height / 2,
    //         rotation: _rotation,
    //         offset: {
    //           x: this.stageSize.width / 2,
    //           y: this.stageSize.height / 2,
    //         },
    //       };
    //     } else {
    //       let _w = this.stageSize.width; // stage宽
    //       let _h = (h * _w) / w; // stage高是图片等比例放大的高
    //       this.stageSize.height = _h;
    //       this.imageConfig = {
    //         image,
    //         width: _w,
    //         height: _h,
    //         x: this.stageSize.width / 2,
    //         y: this.stageSize.height / 2,
    //         rotation: _rotation,
    //         offset: {
    //           x: this.stageSize.width / 2,
    //           y: this.stageSize.height / 2,
    //         },
    //       };
    //     }
    //   };
    // },
    handleAddText() {
      this.drawType = "addText";
      this.isAddTexting = true;
      let _name = "text" + this.texts.length;
      this.texts.push({
        code: _name,
        x: 200,
        y: 300,
        width: 200,
        text: "Insert text here...",
        fill: "red",
        fontSize: 20,
        draggable: true,
      });
      this.handleSaveHistory();
    },
    saveClick() {
      this.handleSave();
    },
    clearClick() {
      this.handleClear();
    },
    settingClick() {
      this.workSettingPopup = true;
    },
    zoomResetClick() {
      this.zoomReset();
    },
    zoomInClick() {
      this.zoomIn();
    },
    zoomOutClick() {
      this.zoomOut();
    },

    componentClick() {
      this.showComponent = !this.showComponent;
    },
    toolBoxClick() {
      this.showToolBox = !this.showToolBox;
    },
    travelDistancePageClick() {
      this.showTravelDistancePage = !this.showTravelDistancePage;
    },
    doorSettingClick(item) {
      var self = this;
      self.doorSettingObj = item;
      // if (self.doorSettingObj.buildingCodeId) {
      //   self.buildingCodeApi
      //     .get(self.roomSettingObj.buildingCodeId)
      //     .then((response) => {
      //       self.selectedBuildingCodeCategory = response.result;
      //       // self.selectedBuildingCodeCategory.name = response.result.name;
      //     })
      //     .catch(({ data }) => {
      //       self.toast("Error", helper.getErrorMessage(data), "danger");
      //     });
      // }

      this.doorSettingPopup = true;
    },
    exitAreaSettingClick(item) {
      var self = this;
      self.exitAreaSettingObj = item;
      this.exitAreaSettingPopup = true;
    },
    exitStairWidthSettingClick(item) {
      var self = this;
      self.exitStairWidthSettingObj = item;
      this.exitStairWidthSettingPopup = true;
    },

    diagonalDistanceSettingClick(item) {
      var self = this;
      self.diagonalDistanceSettingObj = item;
      this.diagonalDistanceSettingPopup = true;
    },
    commonPathSettingClick(item) {
      var self = this;
      self.commonPathSettingObj = item;
      this.commonPathSettingPopup = true;
    },
    travelDistanceSettingClick(item) {
      var self = this;
      self.travelDistanceSettingObj = item;
      this.travelDistanceSettingPopup = true;
    },
    obstacleSettingClick(item) {
      var self = this;
      self.obstacleSettingObj = item;
      this.obstacleSettingPopup = true;
    },

    exitSeperationSettingClick(item) {
      var self = this;
      self.exitSeperationSettingObj = item;
      this.exitSeperationSettingPopup = true;
    },
    exitDoorSettingClick(item) {
      var self = this;
      self.exitDoorSettingObj = item;
      this.exitDoorSettingPopup = true;
    },
    roomSettingClick(item) {
      var self = this;
      self.roomSettingObj = item;
      self.roomDoorList = self.roomSettingObj.roomDoors;

      if (self.roomSettingObj.buildingCodeId) {
        self.buildingCodeApi
          .get(self.roomSettingObj.buildingCodeId)
          .then((response) => {
            self.selectedBuildingCodeCategory = response.result;
            // self.selectedBuildingCodeCategory.name = response.result.name;
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }

      this.roomSettingPopup = true;
    },
    undoClick() {
      this.handlePrevStep();
    },
    redoClick() {
      this.handleNextStep();
    },
    handleSave() {
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
      for (let i = 0; i < self.obj.rooms.length; i++) {
        if (self.obj.rooms[i].minimumNumberOfExitId == "")
          self.obj.rooms[i].minimumNumberOfExitId = null;
      }

      this.api
        .update(self.obj)
        .then((response) => {
          self.toast("Save", "Save Success", "success");
          // self.$router.push({ path: "/tenant/floorPlanlist" });
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    handleSaveBase64() {
      var dataURL = this.$refs.stage.getStage().toDataURL();
      this.downloadURI(dataURL, "stage.png");
    },
    handleStageMouseDown(e) {
      this.isPaint = true;
      if (this.analysisMethod.method == "color") {
        try {
          const mousePos = this.$refs.stage
            .getStage()
            .getRelativePointerPosition();
          const x = mousePos.x;
          const y = mousePos.y;
          var ctx = this.$refs.layer._konvaNode.canvas.getContext("2d");
          var data = ctx.getImageData(x, y, 1, 1).data;
          // console.log("data", ctx.getImageData(x, y, 1, 1).data);

          this.analysisColorCode = [data[0], data[1], data[2]];
          console.log("analysisColorCode", this.analysisColorCode);
        } catch (err) {}
      }
      if (this.analysisMethod.method == "template") {
        const mousePos = this.$refs.stage
          .getStage()
          .getRelativePointerPosition();
        const x = mousePos.x;
        const y = mousePos.y;

        if (this.analysisTemplateList.length > 2)
          this.analysisTemplateList = [];

        this.analysisTemplateList.push({
          code: "analysisTemplateList" + (this.analysisTemplateList.length + 1),
          name:
            "analysisTemplateList " + (this.analysisTemplateList.length + 1),
          x: x,
          y: y,
          width: 0,
          height: 0,
          stroke: Konva.Util.getRandomColor(),
          strokeWidth: 1,
          // closed: true,
          // fill: "rgb(58, 141, 243, 0.3)",
        });

        // this.analysisTemplateList.push({
        //   x: x,
        //   y: y,
        //   width: 0,
        //   height: 0,
        //   color: Konva.Util.getRandomColor(),
        // });
      }
    },
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

    handleRoomMouseDown(e) {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
    },

    updateTransformer() {
      // here we need to manually attach or detach Transformer node
      const transformerNode = this.$refs.transformer.getStage();
      const stage = transformerNode.getStage();
      const { selectedShapeName } = this;
      const selectedNode = stage.findOne("." + selectedShapeName);
      // do nothing if selected node is already attached
      if (selectedNode === transformerNode.node()) {
        return;
      }

      if (selectedNode) {
        // attach to another node
        transformerNode.attachTo(selectedNode);
        // textNode 随着transform宽度增加而增加
        selectedNode.on("transform", function () {
          // reset scale, so only with is changing by transformer
          selectedNode.setAttrs({
            width: selectedNode.width() * selectedNode.scaleX(),
            scaleX: 1,
          });
        });
      } else {
        // remove transformer
        transformerNode.detach();
      }
      transformerNode.getLayer().batchDraw();
    },
    initTextNode(textNode) {
      let _this = this;
      textNode.on("dblclick", () => {
        // hide text node and transformer:
        textNode.hide();
        if (textNode.text() == "请在此双击输入文本内容...") {
          textNode.text("");
        }
        // tr.hide();
        this.$refs.transformer.getStage().hide();
        _this.$refs.layer.getStage().draw();

        // create textarea over canvas with absolute position
        // first we need to find position for textarea
        // how to find it?

        // at first lets find position of text node relative to the stage:
        var textPosition = textNode.absolutePosition();

        // then lets find position of stage container on the page:
        var stageBox = this.$refs.stage
          .getStage()
          .container()
          .getBoundingClientRect();

        // so position of textarea will be the sum of positions above:
        var areaPosition = {
          x: stageBox.left + textPosition.x,
          y: stageBox.top + textPosition.y + document.documentElement.scrollTop,
        };

        // create textarea and style it
        var textarea = document.createElement("textarea");
        document.body.appendChild(textarea);

        // apply many styles to match text on canvas as close as possible
        // remember that text rendering on canvas and on the textarea can be different
        // and sometimes it is hard to make it 100% the same. But we will try...
        textarea.value = textNode.text();
        textarea.style.position = "absolute";
        textarea.style.top = areaPosition.y + "px";
        textarea.style.left = areaPosition.x + "px";
        textarea.style.zIndex = 99999999;
        textarea.style.width = textNode.width() - textNode.padding() * 2 + "px";
        textarea.style.height =
          textNode.height() - textNode.padding() * 2 + 5 + "px";
        textarea.style.fontSize = textNode.fontSize() + "px";
        textarea.style.border = "none";
        textarea.style.padding = "0px";
        textarea.style.margin = "0px";
        textarea.style.overflow = "hidden";
        textarea.style.background = "none";
        textarea.style.outline = "none";
        textarea.style.resize = "none";
        textarea.style.lineHeight = textNode.lineHeight();
        textarea.style.fontFamily = textNode.fontFamily();
        textarea.style.transformOrigin = "left top";
        textarea.style.textAlign = textNode.align();
        textarea.style.color = textNode.fill();
        var rotation = textNode.rotation();
        var transform = "";
        if (rotation) {
          transform += "rotateZ(" + rotation + "deg)";
        }

        var px = 0;
        // also we need to slightly move textarea on firefox
        // because it jumps a bit
        var isFirefox =
          navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
        if (isFirefox) {
          px += 2 + Math.round(fontSize / 20);
        }
        transform += "translateY(-" + px + "px)";

        textarea.style.transform = transform;

        // reset height
        textarea.style.height = "auto";
        // after browsers resized it we can set actual value
        textarea.style.height = textarea.scrollHeight + 3 + "px";

        textarea.focus();

        function removeTextarea() {
          textarea.parentNode.removeChild(textarea);
          window.removeEventListener("click", handleOutsideClick);
          textNode.show();

          // tr.show();
          // tr.forceUpdate();
          _this.$refs.transformer.getStage().show();
          _this.$refs.transformer.getStage().forceUpdate();
          _this.$refs.layer.getStage().draw();
        }

        function setTextareaWidth(newWidth) {
          if (!newWidth) {
            // set width for placeholder
            newWidth = textNode.placeholder.length * textNode.fontSize();
          }
          // some extra fixes on different browsers
          var isSafari = /^((?!chrome|android).)*safari/i.test(
            navigator.userAgent
          );
          var isFirefox =
            navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
          if (isSafari || isFirefox) {
            newWidth = Math.ceil(newWidth);
          }

          var isEdge =
            document.documentMode || /Edge/.test(navigator.userAgent);
          if (isEdge) {
            newWidth += 1;
          }
          textarea.style.width = newWidth + "px";
        }

        textarea.addEventListener("keydown", function (e) {
          // hide on enter
          // but don't hide on shift + enter
          if (e.keyCode === 13 && !e.shiftKey) {
            textNode.text(textarea.value);
            removeTextarea();
          }
          // on esc do not set value back to node
          if (e.keyCode === 27) {
            removeTextarea();
          }
        });

        textarea.addEventListener("keydown", function (e) {
          var scale = textNode.getAbsoluteScale().x;
          setTextareaWidth(textNode.width() * scale);
          textarea.style.height = "auto";
          textarea.style.height =
            textarea.scrollHeight + textNode.fontSize() + "px";
        });

        function handleOutsideClick(e) {
          if (e.target !== textarea) {
            removeTextarea();
          }
        }

        setTimeout(() => {
          window.addEventListener("click", handleOutsideClick);
        });
      });
    },
    downloadURI(uri, name) {
      this.imgSrc = uri;
    },
  },
};
</script>

<style>
.context-menu {
  position: fixed;
  background: white;
  z-index: 999;
  outline: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  cursor: pointer;
}
.work-navigation {
  display: inline-block;
  position: absolute;
  z-index: 100;
  left: 0;
  bottom: 30px;
  width: 50px;
  /* width: 100%;
  height: 100vh; */
}
.work-component {
  display: inline-block;
  position: absolute;
  z-index: 100;
  right: 0;
  width: 320px;
  /* width: 100%;
  height: 100vh; */
}

.work-tools {
  display: inline-block;
  position: absolute;
  z-index: 100;
  left: 0;
  /* width: 320px; */
  /* width: 100%;
  height: 100vh; */
}

.analysis-tool-template {
  display: inline-block;
  position: absolute;
  z-index: 100;
  /* top: 50%; */
  /* left: 50%; */
  right: 0;
  /* margin-top: -100px; */
  margin-left: -100px;
  /* left: 0; */
  /* width: 320px; */
  /* width: 100%;
  height: 100vh; */
}
</style>